import {Component, OnInit} from '@angular/core';
import {Property} from "../classes";
import {d3} from 'd3-timelines'

@Component({
  selector: 'dcd-property-class',
  templateUrl: './property-class.component.html',
  styleUrls: ['./property-class.component.css']
})
export class PropertyClassComponent implements OnInit {

  property : Property;
  colors = ['Brown', 'BlueViolet', 'CornflowerBlue', 'DarkGreen', 'Crimson',
    'Chocolate', 'DarkRed', 'GoldenRod', 'HotPink', 'LightSlateGray', 'Peru',
    'YellowGreen', 'Thistle', 'Wheat', 'SlateGrey', 'SeaGreen'];

  constructor() {

  }

  ngOnInit() {
    const chart = d3.timeline();

    const testData = [
      {label: "person a", times: [
          {"starting_time": 1355752800000, "ending_time": 1355759900000},
          {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
      {label: "person b", times: [
          {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
      {label: "person c", times: [
          {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
    ];

    const svg = d3.select("#timeline").append("svg").attr("width", 500)
      .datum(testData).call(chart);
  }

  addClass(thingId: string, propertyId: string) {

  }
}
