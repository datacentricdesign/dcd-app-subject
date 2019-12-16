import {Component, Inject, PLATFORM_ID, Input, OnInit} from '@angular/core';
import {Property} from '../classes'
import {isPlatformServer} from "@angular/common";
import {MatSlideToggleChange} from '@angular/material';
import {HttpClientService} from '../http-client.service'

@Component({
  selector: 'dcd-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  @Input() property: Property;
  @Input() rangeTime: number[];

  propertyType: string;
  values: any[] = [];
  rangeDates: Date[];
  apiKey: string = '';
  checked: boolean = false;
  mode: string = "Manual selected values";
  refresh: any;
  showcalendar: boolean = true;
  dateTime = new Date();

  constructor(private service: HttpClientService, @Inject(PLATFORM_ID) private platformId: Object,) {
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      console.log('Init Property component server');
    } else {
      if (this.property.values) {
        if (this.property.values.length > 0) {
          this.values = this.property.values
        }
      }
      if (this.rangeTime) {
        this.BrowserUniversalInit(this.rangeTime[0], this.rangeTime[1])
      } else {
        this.BrowserUniversalInit(0, (new Date).getTime())
      }
    }
  }


  BrowserUniversalInit(from: number, to: number) {
    this.rangeDates = [new Date(from), new Date(to)];
    this.getValues([new Date(from), new Date(to)]);
    switch (this.property.type) {
      case "TEXT": {
        this.propertyType = "TEXT";
        break
      }
      case "LOCATION": {
        this.service.get('mapsKey').subscribe(
          data => {
            this.apiKey = data['key']
          });
        this.propertyType = "LOCATION";
        break
      }

      //3D
      case "TWELVE_DIMENSIONS":
      case "ELEVEN_DIMENSIONS":
      case "TEN_DIMENSIONS":
      case "NINE_DIMENSIONS":
      case "EIGHT_DIMENSIONS":
      case "SEVEN_DIMENSIONS":
      case "SIX_DIMENSIONS":
      case "FIVE_DIMENSIONS":
      case "FOUR_DIMENSIONS":
      case "THREE_DIMENSIONS":
      case "GYROSCOPE":
      case "GRAVITY":
      case "MAGNETIC_FIELD":
      case "ROTATION_VECTOR":
      case "ACCELEROMETER" : {
        this.propertyType = "X_DIMENSIONS";
        break
      }
      case "HEART_RATE":
      case "TWO_DIMENSIONS" : {
        this.propertyType = "TWO_DIMENSIONS";
        break
      }
      default: {
        this.propertyType = "ONE_DIMENSION";
        break
      }

    }
  }

  getValues(rangeDates: Date[]) {
    if (rangeDates.length == 2) {
      if (rangeDates[0] && rangeDates[1]) {
        const from_: number = rangeDates[0].getTime();
        const to_: number = rangeDates[1].getTime() + 24 * 60 * 60 * 1000;
        this.service.get('api/things/' + this.property.entity_id + '/properties/' + this.property.id + '?from=' + from_ + '&to=' + to_).subscribe(
          data => {
            if (data['property']) {
              if (Array.isArray(data['property'].values)) {
                this.values = data['property'].values;
                if (data['property'].values.length > 0) {
                  const first_date = new Date(data['property'].values[0][0]);
                  const last_date = new Date(data['property'].values[data['property'].values.length - 1][0]);
                  this.rangeDates = [first_date, last_date];
                  this.showcalendar = !this.showcalendar
                }
              }
            }
          })
      }
    }
  }

  toggle(event: MatSlideToggleChange) {
    this.checked = event.checked;
    if (event.checked) {
      //set timeout
      const now = new Date();
      this.rangeDates[0] = new Date(now.getTime() - 60000);
      this.rangeDates[1] = now;
      this.mode = "Real time values";
      this.refresh = setInterval(() => {
        this.getValues(this.rangeDates)
      }, 5000);
    } else {
      //cleartimeout
      this.mode = "Manual selected values";
      clearInterval(this.refresh)
    }
  }

  ngOnDestroy() {
    clearInterval(this.refresh)
  }


}
