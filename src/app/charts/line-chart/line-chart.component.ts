import { Component,Input,SimpleChanges} from '@angular/core';
import {Property,Dimension} from '../../../classes'


@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent {

    @Input() property:Property
    @Input() dimensions: Dimension[];

    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Date';
    showYAxisLabel = true;
    yAxisLabel = '';
    timeline = true;
    view:any
    multi : any = [{name: '',series: [{name: '',value: 0}]}]

      onResize(event) {
        this.view = [event.target.innerWidth / 1.35, 400];
    }

    colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    constructor() {
        this.view = [innerWidth / 1.3, 400];
    }

    ngOnChanges(changes: SimpleChanges) {

      if(!(changes.dimensions === undefined)){
        const val = changes.dimensions.currentValue
 
        if(val.length>0){
                this.multi =  []
                for(let value of val){
                  if(value.unit != undefined && value.unit != ''){
                    this.yAxisLabel = value.dimension +' ('+value.unit+' )'
                  }else{
                    this.yAxisLabel = value.dimension +' (no unit)'
                  }
                this.multi.push({
                name : value.dimension,
                series:value.data
                })
                }
        }else{
          this.multi = [{name: '',series: [{name: '',value: 0}]}]
        }
       }
      }

}