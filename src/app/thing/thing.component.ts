import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformServer } from "@angular/common";
import { Router} from '@angular/router';
import { Thing,Property, Value } from '.../../../classes'


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
    values:Value[] =[]
    selectedValues:Value[] = []
    displayedColumns: string[] = ['name', 'type', 'settings'];

    constructor(
        private router: Router,
        //private service: ClientService, 
        private http: HttpClient,
        @Inject(PLATFORM_ID)
        private platformId: Object) {
    }
    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) {
            console.log('Home component server :'); // host on the server  
        }
        else {
            console.log(history.state.data)
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
          console.log(property);
              for(var i = 0; i < this.getDimensionSize(property); i++){
              //this.http.get('api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
              const to : number = (new Date).getTime(); //current UNIX timestamp (in ms)
              const from : number = 0 //to - 24*60*60*1000 //1 day before UNIX timestamp (in ms)
              const dim_name =  property.property_dimensions[i].name
              const dim_unit = property.property_dimensions[i].unit
              const index = i

              console.log('heeeeey',property.property_dimensions[i])
              this.http.get('http://localhost:8080/subject/api/things/'+this.thing.thing_id+'/properties/'+property.property_id+'?from='+from+'&to='+to)
              .toPromise().then(data => {
                console.log('heeeeey',dim_name)
                console.log('Promise6',data)
                this.values.push(new Value(
                  property.property_name,
                  property.property_id,
                  dim_name,
                  dim_unit,
                  this.getData(index,data['property'].values)
                  ))
              })
                //this.values.push(new Value(property.property_name,property.property_id,property.property_dimensions[i].name,property.property_dimensions[i].unit))
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
      console.log(rangeDates)
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            console.log('do get')
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 
            console.log('from :',from,'to :',to)
            for(let value of this.values){
              //this.http.get('api/things/'+this.ChildThing.thing_id+'/properties/'+this.ChildProperty.property_id+'?from='+from+'&to='+to)
              this.http.get('http://localhost:8080/subject/api/things/'+this.thing.thing_id+'/properties/'+value.property_id+'?from='+from+'&to='+to)
              .toPromise().then(data => {
                console.log('Promise6',data)
              })
            }

        }
      }
    }

//Line chart
// options
showXAxis = true;
showYAxis = true;
gradient = false;
showLegend = true;
showXAxisLabel = true;
xAxisLabel = 'Date';
showYAxisLabel = true;
yAxisLabel = 'Value';
timeline = true;
view=[1000, 500]

onResize(event) {
  this.view = [event.target.innerWidth / 1.35, 400];
}

colorScheme = {
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
};

handleChange(e) {
console.log('multi',this.multi)
this.multi =  []
for(let value of this.selectedValues){
console.log(value.data)
this.multi.push({
name : value.dimension +' ( '+value.property_name +' )',
series:value.data
})
}
}

multi: any[] = [
  {
    name: 'Red',
    series: [
      {
        name: new Date(2017, 0, 1, 2, 34, 17),
        value: 294
      },
      {
        name: new Date(2017, 2, 1, 2, 34, 17),
        value:  264
      }
    ]
  },
  {
    name: 'White',
    series: [
      {
        name: new Date(2017, 0, 1, 2, 34, 17),
        value: 347
      },
      {
        name: new Date(2017, 1, 1, 2, 34, 17),
        value: 369
      },
      {
        name: new Date(2017, 2, 1, 2, 34, 17),
        value:  325
      }
    ]
  },
  {
    name: 'Blue',
    series: [
      {
        name: new Date(2017, 0, 1, 2, 34, 17),
        value: 200
      },
      {
        name: new Date(2017, 1, 1, 2, 34, 17),
        value: 220
      },
      {
        name: new Date(2017, 2, 1, 2, 34, 17),
        value:  230
      },
      {
        name: new Date(2017, 4, 1, 2, 34, 17),
        value:  230
      }
    ]
  }
];
  
}
