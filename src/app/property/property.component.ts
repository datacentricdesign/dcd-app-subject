import { Component, Inject, Optional,PLATFORM_ID,Input, OnInit} from '@angular/core';
import { Thing } from '../../../dcd/entities/thing'
import { Property, PropertyType } from '.../../../dcd/entities/property'

import { ClientService } from '../client.service';
import {isPlatformServer} from "@angular/common";

import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
    HttpParams,
  } from "@angular/common/http";
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.css']
})

export class PropertyComponent implements OnInit {

    @Input() ChildThing: Thing;
    @Input() ChildProperty: Property;

    property_type : string;
    property_data :{}[/*{property_dimension : string,property_unit : string,property_value :  any}*/] = []

    //Maps
    lat: number;
    lng: number;
    key:string = 'AIzaSyD6TYz32l0J6kFrPTapRm2z5RwGxBBKbFA'
    markers : {}
    
    //Radar Chart
    radarChartOptions: RadialChartOptions = {responsive: true,scales: {gridLines: {color: ['rgba(10, 102, 40, 1)']}}};
    colors = [{backgroundColor: 'rgba(103, 58, 183, .1)',borderColor: 'rgb(103, 58, 183)',pointBackgroundColor: 'rgb(103, 58, 183)',pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(103, 58, 183, .8)'},];
    radarChartType: ChartType = 'radar';
    radarChartLabels: Label[] = []
    radarChartData: ChartDataSets[]  = [{data:[],label:'TODO'}]
        
    constructor(private service: ClientService, private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,) {}
    

    ngOnInit(): void {
      console.log('childT',this.ChildThing)
      console.log('childP',this.ChildProperty) 
        if (isPlatformServer(this.platformId)) {
            console.log('Property component server') 
            } else {
             this.BrowserUniversalInit()
          }
    }

    BrowserUniversalInit(){
            this.property_type = this.ChildProperty.property_type
            
            switch(this.ChildProperty.property_type) {
                case PropertyType.LOCATION: {
                    console.log('type', PropertyType.LOCATION)
                    console.log('dimensions',this.ChildProperty.property_dimensions)

            //RANDOM VALUES        
                    //ADD MARKER IN MAPS
                    this.lat = 52.0186
                    this.lng = 4.3782

                    this.markers = {
                      markers:  [{
                        lat: 52.0186,
                        lng: 4.3782,
                        icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                        infoWindowOptions: {
                        content: this.ChildThing.thing_name
                        }
                      }],
                      fitBounds: true,
                      }

                      //ADD PROPERTY DATA
                      this.property_data.push(
                        {
                        property_dimension : this.ChildProperty.property_dimensions[0].name,
                        property_unit : this.ChildProperty.property_dimensions[0].unit,
                        property_value :  52.0186  //TODO RECUP THE LAST VALUE
                        },

                        {
                          property_dimension : this.ChildProperty.property_dimensions[1].name,
                          property_unit : this.ChildProperty.property_dimensions[1].unit,
                          property_value :  4.3782
                          }
                      )

            //TODO GET LAST VALUES

            //TODO AN UPDATE VALUE WITH HTTP  => use setinterval ?  SOCKET ? MQTT ? 

                    break
                }

              //3D 
              case PropertyType.GYROSCOPE:
              case PropertyType.GRAVITY:
              case PropertyType.MAGNETIC_FIELD:
              case PropertyType.GRAVITY:
              case PropertyType.ROTATION_VECTOR:
              case PropertyType.ACCELEROMETER : {
                console.log('type',this.ChildProperty.property_type)
                console.log('dimensions',this.ChildProperty.property_dimensions)
                var data :  number[] = []
                for(var i = 0; i < 3; i++){
                  console.log(this.ChildProperty.property_dimensions[i].name)

        //RANDOM VALUES
                    //ADD LABELS TO CHART
                    this.radarChartLabels.push(this.ChildProperty.property_dimensions[i].name)
                  

                    //ADD VALUES TO CHART
                    //Random value
                    const randomnum : number = this.getRandomInRange(3,5,2)
                    console.log(randomnum)
                    data.push(randomnum)

                    //ADD PROPERY DATA
                    this.property_data.push(
                      {
                      property_dimension : this.ChildProperty.property_dimensions[i].name,
                      property_unit : this.ChildProperty.property_dimensions[i].unit,
                      property_value :  randomnum
                      }
                    )

                    if(i == 2){
                      this.radarChartData = [{data:data,label:this.property_type}]
                    }

          //TODO GET LAST VALUES

          //TODO AN UPDATE VALUE WITH HTTP  => use setinterval ?  SOCKET ? MQTT ? 


                }
                break
            }
                default: {
                    console.log('type',this.ChildProperty.property_type)
                   console.log('This should never happen')
                    break
                }
     
             }
        }

        getRandomInRange(from, to, fixed) {
          return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
          // .toFixed() returns string, so ' * 1' is a trick to convert to number
      }

}