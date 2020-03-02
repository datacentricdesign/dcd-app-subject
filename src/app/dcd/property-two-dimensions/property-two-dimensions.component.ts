import { Component, OnInit, Input, SimpleChanges} from '@angular/core';
import {Dimension} from '../classes'

@Component({
  selector: 'dcd-property-two-dimensions',
  templateUrl: './property-two-dimensions.component.html',
  styleUrls: ['./property-two-dimensions.component.css']
})
export class PropertyTwoDimensionsComponent implements OnInit {

  @Input() property_values : any[];
  @Input() property_dimensions:any[];
  dimensions: Dimension[] = [];
  sliderSize:number = 0;
  showData : boolean = false;
  index_slider : number;
  date:Date;

  view:any[];

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

  constructor() { }

  ngOnInit() {
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
}

ngOnChanges(changes: SimpleChanges) {

  if(changes.property_values){
    const values = changes.property_values.currentValue;
    if(values.length>0){
          this.multi = [];
          this.showData = true;
          this.sliderSize = values.length-1;
          this.index_slider = values.length-1;
          this.date = new Date(values[this.index_slider][0]);
          this.dimensions =  [];

          for(let index = 0; index <= this.property_dimensions.length; index++){
            if(index == this.property_dimensions.length ){
              for(let value of this.dimensions){
                if(this.multi.length == 0){
                  if(value.unit){
                    this.yAxisLabel = value.dimension +' ('+value.unit+' )'
                  }else{
                    this.yAxisLabel = value.dimension +' (no unit)'
                  }
                  this.multi.push({
                    name : value.dimension,
                    series:value.data
                    })

                }else{
                  if(value.unit){
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
            } else {
            const dim_name =  this.property_dimensions[index].name;
            const dim_unit = this.property_dimensions[index].unit;
            this.dimensions.push(new Dimension(
              '',
              '',
              dim_name,
              dim_unit,
              Dimension.getData(index, values)
              ))

            }
          }
        }else{
          this.showData = false;
          this.multi = [{name: '',series: [{name: '',value: 0}]}]
        }
      }
   }

   handleChange(e) {
    //e.value is the new value (is index)
    this.index_slider = e.value;
    this.date = new Date(this.property_values[this.index_slider][0])
}

}
