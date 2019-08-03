import { Component,Input, SimpleChanges} from '@angular/core';
import {Property,Dimension} from '../../../classes'
import { ChartDataSets, ChartType, RadialChartOptions} from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
    selector: 'app-radar-chart',
    templateUrl: './radar-chart.component.html',
    styleUrls: ['./radar-chart.component.css']
})

export class RadarChartComponent {

    @Input() property:Property
    @Input() dimensions: Dimension[];

         radarChartOptions: RadialChartOptions = {responsive: true}
         colors = [{backgroundColor: 'rgba(103, 58, 183, .1)',borderColor: 'rgb(103, 58, 183)',pointBackgroundColor: 'rgb(103, 58, 183)',pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(103, 58, 183, .8)'},];
         radarChartType: ChartType = 'radar';
         radarChartLabels: Label[] = []
         radarChartData: ChartDataSets[];

         showData : boolean = false
         index : number = 0
         sliderSize:number = 0

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {

      if(!(changes.dimensions === undefined)){
        const val:Dimension[] = changes.dimensions.currentValue
        this.sliderSize = val[0].data.length -1
 
        if(val.length>0){
            if(val[0].data.length>0){
               this.showData = true
               this.index = val[0].data.length-1

               this.radarChartLabels = []
               var last_data : number[] = []
               var maxnum : number = 0

               for( var i = 0; i<=val.length;i++){

                if(i == val.length){
                    this.radarChartOptions = {responsive: true,scale: {ticks: {beginAtZero: true,min: 0,max: maxnum+1,stepSize: 1},}}
                    this.radarChartData = [{data:last_data,label:this.property.type}]
                  }else{
                    const value = val[i]
                    const num =  value.data[this.index].value
    
                    if (maxnum < num){maxnum = num}
    
                    last_data.push(num)
                    this.radarChartLabels.push(value.dimension)
                  }

               }

            }else{
              this.showData = false
              this.radarChartData = [{data:[],label:this.property.type}]
            }
        }
      }

    }

       handleChange(e) {
        //e.value is the new value (is index)
        this.index = e.value
        var last_data : number[] = []
        var maxnum : number = 0


        for( var i = 0; i<=this.dimensions.length;i++){

            if(i == this.dimensions.length){
                this.radarChartData[0].data = last_data
                this.radarChartOptions.scale.ticks.max = maxnum + 1
              }else{
                const value = this.dimensions[i]
                const num =  value.data[this.index].value

                if (maxnum < num){maxnum = num}

                last_data.push(num)
              }

           }
    }

}