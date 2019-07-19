import { Component, Inject,PLATFORM_ID,Input, OnInit} from '@angular/core';

import { Thing, Property,Dimension, server_url } from '../../classes'

import {isPlatformServer} from "@angular/common";

import { MatSlideToggleChange } from '@angular/material';

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

    @Input() ChildProperty: Property;
    @Input() RangeTime: number[];

    chart_type : string;
    values : any[] = []
    dimensions : Dimension[] = []
    rangeDates: Date[]
    apiKey:string = ''
    checked:boolean = false
    mode : string = "Manual selected values"
    refresh : any
        
     constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,) {}
 
     ngOnInit(): void {
         if (isPlatformServer(this.platformId)) {
           //server side
             } else {
              if(this.RangeTime === undefined){
                const from : number = 0
                const to : number = (new Date).getTime();
                this.BrowserUniversalInit(from,to)
              }else{
                const from : number = this.RangeTime[0]
                const to : number = this.RangeTime[1];
                this.BrowserUniversalInit(from,to)
              }
              
           }
     }
 
     BrowserUniversalInit(from:number,to:number){
             //const to : number = (new Date).getTime();
             //const from : number = 0
              this.http.get(server_url+'api/things/'+this.ChildProperty.property_entitiy_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
             .toPromise().then(data => {
              if(data['property'].values.length > 0){
              const first_date = new Date(data['property'].values[0][0])
              const last_date = new Date(data['property'].values[data['property'].values.length-1][0])
              this.rangeDates = [first_date,last_date]
              }
              this.values = data['property'].values
              for(var i = 0; i < this.getDimensionSize(this.ChildProperty); i++){
              const dim_name =  this.ChildProperty.property_dimensions[i].name
              const dim_unit = this.ChildProperty.property_dimensions[i].unit
              const index = i
              this.dimensions.push(new Dimension(
                this.ChildProperty.property_id,
                this.ChildProperty.property_name,
                dim_name,
                dim_unit,
                this.getData(index,data['property'].values)
                ))
              }
            
             
             switch(this.ChildProperty.property_type) {
                 case "LOCATION": {
                  this.http.get(server_url+'mapsKey')
                  .toPromise().then(data => {
                    this.apiKey=data['key']
                  })
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
 

    getData(index,values:any[]): {value:number,name:Date}[]{
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
             this.http.get(server_url+'api/things/'+this.ChildProperty.property_entitiy_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
            .toPromise().then(data => {
              this.dimensions=[]
              this.values = data['property'].values
              for(var i = 0; i < this.getDimensionSize(this.ChildProperty); i++){
                const dim_name =  this.ChildProperty.property_dimensions[i].name
                const dim_unit = this.ChildProperty.property_dimensions[i].unit
                const index = i
                this.dimensions.push(new Dimension(
                  this.ChildProperty.property_id,
                  this.ChildProperty.property_name,
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

      toggle(event: MatSlideToggleChange) {
        this.checked = event.checked;
        if(event.checked){
          //set timeout
          const now = new Date()
          this.rangeDates[0] = new Date(now.getTime()-60000)
          this.rangeDates[1] = now
          this.mode = "Real time values"
          this.refresh = setInterval(() => {
              this.getValues(this.rangeDates)
            }, 5000);
        }else{
          //cleartimeout
          this.mode = "Manual selected values"
          clearInterval(this.refresh)
        }
    }

    ngOnDestroy() {
      clearInterval(this.refresh)
    }


}