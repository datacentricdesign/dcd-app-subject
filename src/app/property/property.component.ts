import { Component, Inject,PLATFORM_ID,Input, OnInit} from '@angular/core';

import { Thing, Property,Dimension, server_url } from '.../../../classes'

import {isPlatformServer} from "@angular/common";

import { ChartDataSets, ChartType, RadialChartOptions,ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
    HttpParams,
  } from "@angular/common/http";

@Component({
    selector: 'app-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.css']
})

export class PropertyComponent implements OnInit {

    @Input() ChildThing: Thing;
    @Input() ChildProperty: Property;

    chart_type : string;
    values : any[] = []
    dimensions : Dimension[] = []
    rangeDates: Date[]
    apiKey:string = ''
        
     constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,) {}
 
     ngOnInit(): void {
         if (isPlatformServer(this.platformId)) {
           //server side
             } else {
              this.BrowserUniversalInit()
           }
     }
 
     BrowserUniversalInit(){
             this.http.get(server_url+'mapsKey')
             .toPromise().then(data => {
               this.apiKey=data['key']
             })
             const to : number = (new Date).getTime();
             const from : number = 0
              this.http.get(server_url+'api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
             .toPromise().then(data => {

              if(data['property'].values.length > 0){
              const first_date = new Date(data['property'].values[0][0])
              const last_date = new Date(data['property'].values[data['property'].values.length-1][0])
              this.rangeDates = [first_date,last_date]
              this.values = data['property'].values
              }
              this.values = data['property'].values
              for(var i = 0; i < this.getDimensionSize(this.ChildProperty); i++){
              const dim_name =  this.ChildProperty.property_dimensions[i].name
              const dim_unit = this.ChildProperty.property_dimensions[i].unit
              const index = i
              this.dimensions.push(new Dimension(
                data['property'].name,
                dim_name,
                dim_unit,
                this.getData(index,data['property'].values)
                ))
              }
             
             switch(this.ChildProperty.property_type) {
                 case "LOCATION": {
                     this.chart_type = "MAPS"
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
               case "GYROSCOPE":
               case "GRAVITY":
               case "MAGNETIC_FIELD":
               case "GRAVITY":
               case "ROTATION_VECTOR":
               case "ACCELEROMETER" : {
                 this.chart_type = "RADAR"
                 break
             } 
              case "HEART_RATE":
              case "TWO_DIMENSIONS" : {
                this.chart_type = "DOUBLE"
                 break
             }
                 default: {
                     this.chart_type = "LINE"
                     break
                 }
      
              }
             })
         }
 

    getData(index,values:[]): {value:number,name:Date}[]{
      var array :  {value:number,name:Date}[] = []
      for(var i = 0; i <= values.length; i++){
        if(i == values.length){
          return array
        }else{
            array.push(
              {
                value: values[i][index+1],
                name: new Date(values[i][0])
              }
            )
        }
      }
    }

    getValues(rangeDates){
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 
             this.http.get(server_url+'api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
            .toPromise().then(data => {
              this.dimensions=[]
              this.values = data['property'].values
              for(var i = 0; i < this.getDimensionSize(this.ChildProperty); i++){
                const dim_name =  this.ChildProperty.property_dimensions[i].name
                const dim_unit = this.ChildProperty.property_dimensions[i].unit
                const index = i
                this.dimensions.push(new Dimension(
                  data['property'].name,
                  dim_name,
                  dim_unit,
                  this.getData(index,data['property'].values)
                  ))
                }
            })

        }
      }
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


           //Radar Chart
     /*radarChartOptions: RadialChartOptions
     colors = [{backgroundColor: 'rgba(103, 58, 183, .1)',borderColor: 'rgb(103, 58, 183)',pointBackgroundColor: 'rgb(103, 58, 183)',pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(103, 58, 183, .8)'},];
     radarChartType: ChartType = 'radar';
     radarChartLabels: Label[] = []
     radarChartData: ChartDataSets[];

     //BUBBLE CHART
     view:any[]

     colorScheme = {
       name: 'coolthree',
       selectable: true,
       group: 'Ordinal',
       domain: [
         '#01579b', '#7aa3e5', '#a8385d', '#00bfa5'
       ]
     };
     gradient = false;
     showXAxis = true;
     showYAxis = true;
     showLegend = false;
     showXAxisLabel = true;
     showYAxisLabel = true;
     xAxisLabel = 'date';
     yAxisLabel = 'price';
     yAxisLabel2 = 'count';
     autoScale = true;
     timeLine = true;
     animations = false;
     tooltipDisabled = false;
   
     // data for charts
     multi = [{
       name: 'first',
       series: [{
         name: new Date('2018-01-01T00:00:00'),
         value: '100'
       }, {
         name: new Date('2018-02-01T00:00:00'),
         value: '200'
       }, {
         name: new Date('2018-03-01T00:00:00'),
         value: '150'
       }, {
         name: new Date('2018-04-01T00:00:00'),
         value: '50'
       }, {
         name: new Date('2018-05-01T00:00:00'),
         value: '100'
       }]
     }, {
       name: 'second',
       secondAxis: true,
       series: [{
         name: new Date('2018-01-01T00:00:00'),
         value: '5'
       }, {
         name: new Date('2018-02-01T00:00:00'),
         value: '4'
       }, {
         name: new Date('2018-03-01T00:00:00'),
         value: '1'
       }, {
         name: new Date('2018-04-01T00:00:00'),
         value: '3'
       }, {
         name: new Date('2018-05-01T00:00:00'),
         value: '2'
       }]
     }];*/

}