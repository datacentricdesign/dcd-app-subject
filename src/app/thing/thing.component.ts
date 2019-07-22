import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformServer } from "@angular/common";
import { Router} from '@angular/router';
import { Thing,Property, Dimension, server_url } from '../../classes'
import { MatSlideToggleChange } from '@angular/material';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

@Component({
    selector: 'app-thing',
    templateUrl: './thing.component.html',
    styleUrls: ['./thing.component.css']
})
export class ThingComponent implements OnInit {

    thing : Thing = new Thing({})
    rangeDates: Date[]
    dimensions:Dimension[] =[]
    selectedDimensions:Dimension[] = []
    displayedColumns: string[] = ['name', 'type', 'settings'];
    RangeTime: number[];
    showcalendar:boolean = true
    checked:boolean = false
    mode : string = "Manual selected values"
    refresh : any
    first_from : Date

    constructor(
        private router: Router,
        private http: HttpClient,
        @Inject(PLATFORM_ID)
        private platformId: Object) {
    }
    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) {
            // server side
        }
        else {
            if(history.state.data === undefined){
                this.router.navigate(['/subject/page/home'])
            }else{
                this.thing = new Thing({
                    id : history.state.data.id,
                    name : history.state.data.name,
                    type : history.state.data.type,
                    description : history.state.data.description,
                    properties : history.state.data.properties
                })

                if(history.state.range === undefined){
                  const from : number = 0
                  const to : number = (new Date).getTime();
                  this.BrowserUniversalInit(from,to);
                }else{
                  console.log('history range',history.state.range)
                  this.RangeTime = history.state.range
                  const from : number = history.state.range[0]
                  const to : number = history.state.range[1]
                  this.BrowserUniversalInit(from,to);
                }
            }
        }
    }
    BrowserUniversalInit(from:number,to:number) {
        for (let property of this.thing.thing_properties) {
              for(var i = 0; i < this.getDimensionSize(property); i++){
              const dim_name =  property.property_dimensions[i].name
              const dim_unit = property.property_dimensions[i].unit
              const index = i

              this.http.get(server_url+'api/things/'+property.property_entitiy_id+'/properties/'+property.property_id+'?from='+from+'&to='+to)
              .toPromise().then(data => {
                if(data['property'].values.length > 0){
                this.dimensions.push(new Dimension(
                  property.property_id,
                  property.property_name,
                  dim_name,
                  dim_unit,
                  this.getData(index,data['property'].values)
                  ))
                  const first_date = new Date(data['property'].values[0][0])
                  const last_date = new Date(data['property'].values[data['property'].values.length-1][0])
                  console.log(first_date,last_date)
                  if(this.rangeDates === undefined){
                    this.first_from = first_date
                    this.rangeDates = [first_date,last_date]
                  }else{
                    if(first_date.getTime()<this.rangeDates[0].getTime()){
                      this.first_from = first_date
                      this.rangeDates[0]=first_date
                      this.showcalendar = !this.showcalendar
                    }
                    if(last_date.getTime()>this.rangeDates[1].getTime()){
                      this.rangeDates[1]=last_date
                      this.showcalendar = !this.showcalendar
                    }
                  }
                  }
              })
              }
        };
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


    getValues(rangeDates){
      this.clearChart()
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            this.dimensions = []
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 

            for (let property of this.thing.thing_properties) {
              for(var i = 0; i < this.getDimensionSize(property); i++){
              const dim_name =  property.property_dimensions[i].name
              const dim_unit = property.property_dimensions[i].unit
              const index = i

              this.http.get(server_url+'api/things/'+property.property_entitiy_id+'/properties/'+property.property_id+'?from='+from+'&to='+to)
              .toPromise().then(data => {
                if(data['property'].values.length > 0){
                this.dimensions.push(new Dimension(
                  property.property_id,
                  property.property_name,
                  dim_name,
                  dim_unit,
                  this.getData(index,data['property'].values)
                  ))
                }
              })
              
              }
        };

        }
      }
    }

    updateValues(rangeDates){
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 

            for (let property of this.thing.thing_properties) {
              for(var i = 0; i < this.getDimensionSize(property); i++){
              const index = i
              const dim_name =  property.property_dimensions[i].name

              this.http.get(server_url+'api/things/'+property.property_entitiy_id+'/properties/'+property.property_id+'?from='+from+'&to='+to)
              .toPromise().then(data => {
                this.updateDimension(property.property_id,dim_name,this.getData(index,data['property'].values))
              })
              
              }
        };

        }
      }
    }

    updateDimension(property_id:string,dim_name,data:{value:number,name:Date}[]){
      this.selectedDimensions.forEach(dim => {
        if(dim.property_id == property_id && dim.dimension == dim_name){
          dim.data = data
        }
      });
    }

gradient = false;
showXAxis = true;
showYAxis = true;
showLegend = false;
showXAxisLabel = true;
showYAxisLabel = true;
xAxisLabel = 'date';
yAxisLabel = '';
yAxisLabel2 = '';
autoScale = true;
timeLine = true;
animations = false;
tooltipDisabled = false;

view=[1000, 500]

onResize(event) {
  this.view = [event.target.innerWidth / 1.35, 400];
}
colorScheme = {
  name: 'coolthree',
  selectable: true,
  group: 'Ordinal',
  domain: [
    '#01579b', '#7aa3e5', '#a8385d', '#00bfa5','#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'
  ]
};

firstunit:string
dim1:any[] = []
dim2:any[] = []

handleChange(e) {
// e = true or false => checkbox
this.multi = []
this.dim1 = []
this.dim2 = []
for(let value of this.selectedDimensions){
  if(this.multi.length == 0){
    this.firstunit = value.unit
    this.addDim(value,this.dim1)
    if(value.unit != undefined && value.unit != ''){
      this.yAxisLabel = this.toString(this.dim1) +' ('+value.unit+')'
    }else{
      this.yAxisLabel = this.toString(this.dim1)+ ' (no unit)'
    }
    this.multi.push({
      name : value.dimension+ ' ('+value.property_name+')',
      series:value.data
      })

  }else{
    if(this.firstunit != value.unit){
      this.addDim(value,this.dim2)
      if(value.unit != undefined && value.unit != ''){
        this.yAxisLabel2 = this.toString(this.dim2) +' ('+value.unit+')'
      }else{
        this.yAxisLabel2 = this.toString(this.dim2) + ' (no unit)'
      }
      this.multi.push({
        name : value.dimension+ ' ('+value.property_name+')',
        secondAxis:true,
        series:value.data
        })
    }else{
      this.addDim(value,this.dim1)
      if(value.unit != undefined && value.unit != ''){
        this.yAxisLabel = this.toString(this.dim1) +' ('+value.unit+')'
      }else{
        this.yAxisLabel = this.toString(this.dim1) + ' (no unit)'
      }
      this.multi.push({
        name : value.dimension+ ' ('+value.property_name+')',
        series:value.data
        })
    }
  }
}
}

addDim(value:Dimension,array:any[]){
  if(array.length == 0){
    array.push([[value.dimension],value.property_name])
  }else{
    array.forEach((e,index)=>{
      if(value.property_name == e[1]){
        e[0].push(value.dimension)
        return
      }
      if(index == array.length-1){
        array.push([[value.dimension],value.property_name])
      }
    })
  }
}

toString(array:any[]):string{
  var res = ""
  for(var i=0; i <= array.length;i++){
    if(i == array.length){
      return res
    }else{
      res+="[ ["+array[i][0].toString()+"],"+array[i][1]+"] "
    }
  }
}

multi: any[] = [/*{name: 'Red',series: [{name: new Date(2017, 0, 1, 2, 34, 17),value: 294}*/]

toggle(event: MatSlideToggleChange) {
  this.checked = event.checked;
  if(event.checked){
    this.clearChart()
    const now = new Date()
    this.rangeDates[0] = new Date(now.getTime()-60000)
    this.rangeDates[1] = now
    this.mode = "Real time values"
    this.refresh = setInterval(() => {
        this.updateValues(this.rangeDates)
        this.handleChange(true)
      }, 5000);
  }else{
    this.clearChart()
    this.rangeDates[0] = this.first_from
    this.mode = "Manual selected values"
    clearInterval(this.refresh)
    this.getValues(this.rangeDates)
  }
}

ngOnDestroy() {
clearInterval(this.refresh)
}

clearChart(){
  this.selectedDimensions = []
  this.multi = []
  this.dim1 = []
  this.dim2 = []
  this.yAxisLabel = "",
  this.yAxisLabel2 = ""
}

}
