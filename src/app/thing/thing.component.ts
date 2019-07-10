import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformServer } from "@angular/common";
import { Router} from '@angular/router';
import { Thing,Property, Dimension, server_url } from '.../../../classes'


import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

@Component({
    //changeDetection: ChangeDetectionStrategy.Default,
    //encapsulation: ViewEncapsulation.Emulated,
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
                    thing_id : history.state.data.id,
                    thing_name : history.state.data.name,
                    thing_type : history.state.data.type,
                    thing_description : history.state.data.description,
                    thing_properties : history.state.data.properties
                })
                this.BrowserUniversalInit();
            }
        }
    }
    BrowserUniversalInit() {
        for (let property of this.thing.thing_properties) {
              for(var i = 0; i < this.getDimensionSize(property); i++){
              const to : number = (new Date).getTime(); //current UNIX timestamp (in ms)
              const from : number = 0 //to - 24*60*60*1000 //1 day before UNIX timestamp (in ms)
              const dim_name =  property.property_dimensions[i].name
              const dim_unit = property.property_dimensions[i].unit
              const index = i

              this.http.get(server_url+'api/things/'+this.thing.thing_id+'/properties/'+property.property_id+'?from='+from+'&to='+to)
              .toPromise().then(data => {
                this.dimensions.push(new Dimension(
                  data['property'].name,
                  dim_name,
                  dim_unit,
                  this.getData(index,data['property'].values)
                  ))

                  if(data['property'].values.length > 0){
                  const first_date = new Date(data['property'].values[0][0])
                  const last_date = new Date(data['property'].values[data['property'].values.length-1][0])
                  this.rangeDates = [first_date,last_date]
                  }
              })
              }
        };
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
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 
            for(let dimension of this.dimensions){
              this.http.get(server_url+'api/things/'+this.thing.thing_id+'/properties/'+"TODO"+'?from='+from+'&to='+to)
              .toPromise().then(data => {
              })
            }

        }
      }
    }

//Line chart
// options
/*showXAxis = true;
showYAxis = true;
gradient = false;
showLegend = true;
showXAxisLabel = true;
xAxisLabel = 'Date';
showYAxisLabel = true;
yAxisLabel = 'Value';
timeline = true;*/

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
dim1:string[]=[]
dim2:string[]=[]

handleChange(e) {
// e = true or false => checkbox
this.multi =  []
this.dim1 = []
this.dim2 = []
for(let value of this.selectedDimensions){
  if(this.multi.length == 0){
    this.firstunit = value.unit
    this.dim1.push(value.dimension)
    if(value.unit != undefined && value.unit != ''){
      this.yAxisLabel = this.dim1.toString() +' ('+value.unit+' )'
    }else{
      this.yAxisLabel = this.dim1.toString() + '(no unit)'
    }
    this.multi.push({
      name : value.dimension,
      series:value.data
      })

  }else{
    if(this.firstunit != value.unit){
      this.dim2.push(value.dimension)
      if(value.unit != undefined && value.unit != ''){
        this.yAxisLabel2 = this.dim2.toString() +' ('+value.unit+' )'
      }else{
        this.yAxisLabel2 = this.dim2.toString() + '(no unit)'
      }
      this.multi.push({
        name : value.dimension,
        secondAxis:true,
        series:value.data
        })
    }else{
      this.dim1.push(value.dimension)
      if(value.unit != undefined && value.unit != ''){
        this.yAxisLabel = this.dim1.toString() +' ('+value.unit+' )'
      }else{
        this.yAxisLabel = this.dim1.toString() + '(no unit)'
      }
      this.multi.push({
        name : value.dimension,
        series:value.data
        })
    }
  }
}
}

multi: any[] = [/*{name: 'Red',series: [{name: new Date(2017, 0, 1, 2, 34, 17),value: 294},{name: new Date(2017, 2, 1, 2, 34, 17),value:  264}]},*/]


}
