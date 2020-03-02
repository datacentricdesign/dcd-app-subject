import {Component, Inject, PLATFORM_ID, OnInit} from '@angular/core';
import {PropertyType} from '../classes'
import {HttpClientService} from '../http-client.service'
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'dcd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  stat_types: string[] = ["LOCATION"];
  stat_range: Date[];
  dateTime = new Date();

  total_persons: number;
  total_things: number;
  total_properties: number;

  type_total_entities: number;
  type_total_properties: number;
  type_total_values: number;

  type_range_entities: number;
  type_range_properties: number;
  type_range_values: number;

  constructor(
    private service: HttpClientService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      console.log('Init Things component server');
    } else {
      this.BrowserUniversalInit()
    }
  }

  BrowserUniversalInit() {
    this.service.get('api/stats').subscribe(
      data => {
        this.total_persons = data['stats'].persons;
        this.total_things = data['stats'].things;
        this.total_properties = data['stats'].properties
      });

    this.GetStatsValues(this.stat_types)
  }

  GetStatsValues(propertyType: string[], from: number = undefined, to: number = undefined) {
    if (propertyType.length > 0) {
      if (from && to) {
        this.service.get('api/stats/propertyTypes?types=' + propertyType.join() + '&from=' + from + '&to=' + to).subscribe(
          data => {
            this.type_total_entities = data['stats'].total_entities;
            this.type_total_properties = data['stats'].total_properties;
            this.type_total_values = data['stats'].total_values;

            this.type_range_entities = data['stats'].range.entities;
            this.type_range_properties = data['stats'].range.properties;
            this.type_range_values = data['stats'].range.values
          })
      } else {
        this.service.get('api/stats/propertyTypes?types=' + propertyType.join()).subscribe(
          data => {
            this.type_total_entities = data['stats'].total_entities;
            this.type_total_properties = data['stats'].total_properties;
            this.type_total_values = data['stats'].total_values;

            this.type_range_entities = data['stats'].range.entities;
            this.type_range_properties = data['stats'].range.properties;
            this.type_range_values = data['stats'].range.values
          })
      }
    }
  }

  EntitiesPercentage(): number {
    if (this.type_total_entities && this.type_total_entities) {
      return Math.ceil((this.type_range_entities / this.type_total_entities) * 100)
    } else {
      return 0
    }
  }

  PropertiesPercentage(): number {
    if (this.type_total_properties && this.type_range_properties) {
      return Math.ceil((this.type_range_properties / this.type_total_properties) * 100)
    } else {
      return 0
    }
  }

  ValuesPercentage(): number {
    if (this.type_total_values && this.type_total_values) {
      return Math.ceil((this.type_range_values / this.type_total_values) * 100)
    } else {
      return 0
    }
  }

  OnChange() {
    if (this.stat_range) {
      if (this.stat_range.length == 2) {
        if (this.stat_range[0] && this.stat_range[1]) {
          this.GetStatsValues(this.stat_types, this.stat_range[0].getTime(), this.stat_range[1].getTime() + 24 * 60 * 60 * 1000)
        }
      } else {
        this.GetStatsValues(this.stat_types)
      }
    } else {
      this.GetStatsValues(this.stat_types)
    }

  }

  GetPropertyType(): string[] {
    const res: string[] = [];
    for (let type in PropertyType) {
      res.push(type)
    }
    return res
  }

}
