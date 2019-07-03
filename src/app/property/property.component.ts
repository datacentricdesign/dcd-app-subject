import { Component, Inject, Optional,PLATFORM_ID,Input, OnInit, ComponentFactoryResolver} from '@angular/core';

import { Thing, Property, PropertyType } from '.../../../classes'

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

    chart_type : string;
    property_data :{}[/*{property_dimension : string,property_unit : string,property_value :  any,property_date:number}*/] = []
    values : any[] = []
    date : Date
    rangeDates: Date[]
    showSlider : boolean = false
    test :  boolean = true

    getValues(rangeDates){
      console.log(rangeDates)
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            console.log('do get')
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 
            console.log('from :',from,'to :',to)
            this.http.get('api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
            // this.http.get('http://localhost:8080/api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
            .toPromise().then(data => {
              console.log('Promise4',data)
              this.values = data['property'].values
              this.showSlider = true
            })

        }
      }
    }

    maptest(){
      this.test = !this.test
    }

    handleChange(e) {
      //e.value is the new value (is index)
      const value = this.values[e.value]
      this.date = new Date(value[0])
      var last_data :  number[] = []
      var maxvalue : number = 0
      for(var i = 1; i <= value.length; i++){
        if(i == value.length){
          console.log('add marker or change radar',i,this.chart_type)
          switch(this.chart_type){
            case "MAPS":
                console.log('houho')
                this.markers = {
                  markers:  [{
                    lat: value[1],
                    lng: value[2],
                    icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                    infoWindowOptions: {
                    content: this.ChildThing.thing_name
                    }
                  }],
                  fitBounds: true,
                  }
              break
            case "RADAR":
                  this.radarChartData[0].data = last_data
                  this.radarChartOptions.scale.ticks.max = maxvalue + 1
              break
            case "DEFAULT":
              console.log('default')
              break
          }
        }else{
          this.property_data[i-1]['property_value'] = value[i]
          last_data.push(value[i])
          if (maxvalue < value[i]){maxvalue = value}
        }
      }

  }
    //Maps
    lat: number = 52.0186
    lng: number = 4.3782
    key:string = 'AIzaSyD6TYz32l0J6kFrPTapRm2z5RwGxBBKbFA' //ADD .env by method with server
    options = {zoom: 1};
    markers : {}
    
    //Radar Chart
    radarChartOptions: RadialChartOptions;
    colors = [{backgroundColor: 'rgba(103, 58, 183, .1)',borderColor: 'rgb(103, 58, 183)',pointBackgroundColor: 'rgb(103, 58, 183)',pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(103, 58, 183, .8)'},];
    radarChartType: ChartType = 'radar';
    radarChartLabels: Label[] = []
    radarChartData: ChartDataSets[];
        
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
            //this.http.get('http://localhost:8080/mapsKey')
            this.http.get('mapsKey')
            .toPromise().then(data => {
              console.log(data)
            })
            const to : number = (new Date).getTime(); //current UNIX timestamp (in ms)
            const from : number = 0 //to - 24*60*60*1000 //1 day before UNIX timestamp (in ms)
            console.log('from :',from,'to :',to)
            this.http.get('api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
            // this.http.get('http://localhost:8080/api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
            .toPromise().then(data => {
              console.log('Promise3',data)
              console.log('value length',data['property'].values.length)

              var last_values = []
              if(data['property'].values.length > 0){
                console.log('last value',data['property'].values[data['property'].values.length-1])
                last_values =  data['property'].values[data['property'].values.length-1]
                this.date = new Date(data['property'].values[data['property'].values.length-1][0])
              }
            
            switch(this.ChildProperty.property_type) {
                case "LOCATION": {
                    this.chart_type = "MAPS"
                    console.log('type', PropertyType.LOCATION)
                    console.log('dimensions',this.ChildProperty.property_dimensions)
                    //ADD MARKER IN MAPS
                    const last_lat = last_values[1]
                    const last_lng = last_values[2]
                    if(last_lat !== undefined && last_lng !== undefined){
                      this.markers = {
                        markers:  [{
                          lat: last_lat,
                          lng: last_lng,
                          icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                          infoWindowOptions: {
                          content: this.ChildThing.thing_name
                          }
                        }],
                        fitBounds: true,
                        }
                    }
                    //ADD PROPERTY DATA
                    this.property_data.push(
                      {
                      property_dimension : this.ChildProperty.property_dimensions[0].name,
                      property_unit : this.ChildProperty.property_dimensions[0].unit,
                      property_value :  last_lat 
                      },

                      {
                        property_dimension : this.ChildProperty.property_dimensions[1].name,
                        property_unit : this.ChildProperty.property_dimensions[1].unit,
                        property_value :  last_lng
                        }
                    )
            //TODO AN UPDATE VALUE WITH HTTP  => use setinterval ?  SOCKET ? MQTT ? 
                    break
                }

              //3D 
              case "TWELVE_DIMENSIONS":
              case "ELEVEN_DIMENSIONS":
              case "TEN_DIMENSIONS":
              case "NINE_DIMENSIONS":
              case "EIGHT_DIMENSIONS":
              case "SEVEN_DIMENSIONS":
              case "SIX_DIMENSIONS":
              case "FIVE_DIMENSIONS":
              case "FOUR_DIMENSIONS":
              case "THREE_DIMENSIONS":
              //case "TWO_DIMENSIONS":
              case "GYROSCOPE":
              case "GRAVITY":
              case "MAGNETIC_FIELD":
              case "GRAVITY":
              case "ROTATION_VECTOR":
              case "ACCELEROMETER" : {
                this.chart_type = "RADAR"
                console.log('type',this.ChildProperty.property_type)
                console.log('dimensions',this.ChildProperty.property_dimensions)
                var last_data :  number[] = []
                var maxvalue : number = 0
                const dim_size : number = this.getDimensionSize(this.ChildProperty)
                console.log('dim_size',dim_size)
                for(var i = 0; i < dim_size; i++){
                //GET LAST VALUES
                    const value = last_values[i+1]
                    console.log('value',value)
                    //ADD LABELS TO CHART
                    this.radarChartLabels.push(this.ChildProperty.property_dimensions[i].name)
                    // ADD LAST VALUES
                    last_data.push(value)
                    //ADD PROPERY DATA
                    this.property_data.push(
                      {
                      property_dimension : this.ChildProperty.property_dimensions[i].name,
                      property_unit : this.ChildProperty.property_dimensions[i].unit,
                      property_value :  value
                      }
                    )
                    if (maxvalue < value){maxvalue = value}
                    if(i == dim_size-1){
                      this.radarChartOptions = {scale: {ticks: {beginAtZero: true,min: 0,max: maxvalue+1,stepSize: 1},}}
                      this.radarChartData = [{data:last_data,label:this.ChildProperty.property_type}]
                    }
                //TODO AN UPDATE VALUE WITH HTTP  => use setinterval ?  SOCKET ? MQTT ? 
                }
                break
            }
                default: {
                    this.chart_type = "DEFAULT"
                    console.log('type',this.ChildProperty.property_type)
                    const dim_size : number = this.getDimensionSize(this.ChildProperty)
                    for(var i = 0; i < dim_size; i++){
                    //GET LAST VALUES
                    const value = last_values[i+1]
                    console.log('value',value)
                    this.property_data.push(
                      {
                      property_dimension : this.ChildProperty.property_dimensions[i].name,
                      property_unit : this.ChildProperty.property_dimensions[i].unit,
                      property_value :  value
                      }
                    )
                    }
                    break
                }
     
             }
            })
        }

        getRandomInRange(from, to, fixed) {
          return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
          // .toFixed() returns string, so ' * 1' is a trick to convert to number
      }

      getDimensionSize(property:Property):number{
        var array :  string[] = []
        for(var i = 0; i <= property.property_dimensions.length; i++){
          if(i == property.property_dimensions.length){
            return array.length
          }else{
            if(!array.includes(property.property_dimensions[i].name)){
              array.push(property.property_dimensions[i].name)
            }
          }
        }
      }

}