import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'dcd-property-text',
  templateUrl: './property-text.component.html',
  styleUrls: ['./property-text.component.css']
})
export class PropertyTextComponent implements OnInit {

  @Input() property_values : any[];

  constructor() { }

  ngOnInit() {
  }

}
