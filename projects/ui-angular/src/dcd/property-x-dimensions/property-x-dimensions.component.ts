import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ChartDataSets, ChartType, RadialChartOptions} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'dcd-property-x-dimensions',
  templateUrl: './property-x-dimensions.component.html',
  styleUrls: ['./property-x-dimensions.component.css'],
})
export class PropertyXDimensionsComponent implements OnInit {

  @Input() property_values: any[];
  @Input() property_type: string;
  @Input() property_dimensions: any[];

  radarChartOptions: RadialChartOptions = {responsive: true};
  colors = [{
    backgroundColor: 'rgba(103, 58, 183, .1)',
    borderColor: 'rgb(103, 58, 183)',
    pointBackgroundColor: 'rgb(103, 58, 183)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
  },];
  radarChartType: ChartType = 'radar';
  radarChartLabels: Label[] = [];
  radarChartData: ChartDataSets[];

  showData: boolean = false;
  index_slider: number = 0;
  sliderSize: number = 0;
  date: Date;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.property_values) {
      const values: any[] = changes.property_values.currentValue;
      this.sliderSize = values.length - 1;

      if (values.length > 0) {
        this.showData = true;
        this.index_slider = values.length - 1;
        this.date = new Date(this.property_values[this.index_slider][0]);
        this.radarChartLabels = [];
        var last_data: number[] = [];
        var maxValue: number = this.getMaxValue();

        for (var i = 0; i <= this.property_dimensions.length; i++) {
          if (i == this.property_dimensions.length) {
            this.radarChartOptions = {
              responsive: true,
              scale: {
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  max: maxValue + 1,
                  stepSize: 1
                },
              }
            };
            this.radarChartData = [{data: last_data, label: this.property_type}]
          } else {
            const value = values[this.index_slider][i + 1];
            last_data.push(value);
            this.radarChartLabels.push(this.property_dimensions[i].name)
          }
        }

      } else {
        this.showData = false;
        this.radarChartData = [{data: [], label: this.property_type}]
      }
    }

  }

  getMaxValue(): number {
    let maxValue: number = 0;
    let count_value: number = 0;
    for (let i = 0; i < this.property_values.length; i++) {
      count_value = count_value + 1;
      let count_dim = 0;
      for (let j = 0; j < this.property_dimensions.length; j++) {
        count_dim = count_dim + 1;
        if (maxValue < this.property_values[i][j + 1]) {
          maxValue = this.property_values[i][j + 1]
        }
        if (count_value == this.property_values.length - 1 && count_dim == this.property_dimensions.length - 1) {
          return maxValue
        }
      }
    }
  }

  handleChange(e) {
    //e.value is the new value (is index)
    this.index_slider = e.value;
    this.date = new Date(this.property_values[this.index_slider][0]);
    let last_data: number[] = [];
    let maxValue: number = 0;

    for (let i = 0; i <= this.property_dimensions.length; i++) {
      if (i == this.property_dimensions.length) {
        this.radarChartOptions.scale.ticks.max = maxValue + 1;
        this.radarChartData[0].data = last_data
      } else {
        const value = this.property_values[this.index_slider][i + 1];
        last_data.push(value);
        if (maxValue < value) {
          maxValue = value
        }
      }
    }
  }

}
