import { Component, Inject,PLATFORM_ID,Input,ViewChild, SimpleChanges} from '@angular/core';

import {Property,Dimension} from '.../../../classes'

import {isPlatformServer} from "@angular/common";

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
    yAxisLabel = 'Value';
    timeline = true;
    view:any
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
      }];

      onResize(event) {
        this.view = [event.target.innerWidth / 1.35, 400];
    }

    colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    constructor(@Inject(PLATFORM_ID) private platformId: Object,) {
        this.view = [innerWidth / 1.3, 400];
    }

    ngOnChanges(changes: SimpleChanges) {

        const val = changes.dimensions.currentValue
        //const val:Dimension[] = changes.values.currentValue
        console.log('got val: ', val);
 
       /* if(val.length>0){
                this.multi =  []
                for(let value of val){
                this.multi.push({
                name : value.dimension,
                series:value.data
                })
                }
        }*/
       }

}