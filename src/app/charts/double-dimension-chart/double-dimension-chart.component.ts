import { Component,Input, SimpleChanges} from '@angular/core';
import {Property,Dimension} from '../../../classes'

@Component({
    selector: 'app-double-dimension-chart',
    templateUrl: './double-dimension-chart.component.html',
    styleUrls: ['./double-dimension-chart.component.css']
})

export class DoubleDimensionChartComponent {

    @Input() property:Property
    @Input() dimensions: Dimension[];

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
     xAxisLabel = 'Date';
     yAxisLabel = '';
     yAxisLabel2 = '';
     autoScale = true;
     timeLine = true;
     animations = false;
     tooltipDisabled = false;
   
     // data for charts
     multi : any = [{name: '',series: [{name: '',value: 0}]}];

     onResize(event) {
      this.view = [event.target.innerWidth / 1.35, 400];
  }

     constructor() {}

     ngOnChanges(changes: SimpleChanges) {

      if(!(changes.dimensions === undefined)){
        const val = changes.dimensions.currentValue 
        if(val.length>0){
                this.multi =  []
                for(let value of val){
                if(this.multi.length == 0){
                  if(value.unit != undefined && value.unit != ''){
                    this.yAxisLabel = value.dimension +' ('+value.unit+' )'
                  }else{
                    this.yAxisLabel = value.dimension +' (no unit)'
                  }
                  this.multi.push({
                    name : value.dimension,
                    series:value.data
                    })

                }else{
                  if(value.unit != undefined && value.unit != ''){
                    this.yAxisLabel2 = value.dimension +' ('+value.unit+' )'
                  }else{
                    this.yAxisLabel2 = value.dimension +' (no unit)'
                  }
                  this.multi.push({
                    name : value.dimension,
                    secondAxis:true,
                    series:value.data
                    })
                }
                }
            }else{
              this.multi = [{name: '',series: [{name: '',value: 0}]}]
            }
          }
       }
       

}