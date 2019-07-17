import { Component, Inject,PLATFORM_ID,Input,SimpleChanges} from '@angular/core';

import {Property,Dimension} from '../../../classes'

import {isPlatformServer} from "@angular/common";

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.css']
})

export class GoogleMapsComponent {

    @Input() property:Property
    @Input() dimensions: Dimension;
    @Input() apiKey: string;

    lat: number
    lng: number
    options
    markers : {}

    showData : boolean = false
    ref : boolean = true 
    index : number
    sliderSize:number = 0

    constructor(@Inject(PLATFORM_ID) private platformId: Object,) {}

    ngOnChanges(changes: SimpleChanges) {

      if(!(changes.dimensions === undefined)){
        const val:Dimension[]  = changes.dimensions.currentValue
        //const val:Dimension[] = changes.values.currentValue
        console.log('got val: ', val);
        this.sliderSize = val[0].data.length -1
 
        if(val.length>0){
            if(val[0].data.length>0){
                this.showData = true
                this.index = val[0].data.length-1
 
                const last_lat = val[0].data[this.index].value
                const last_lng = val[1].data[this.index].value
 
                this.lat = last_lat
                this.lng = last_lng
 
                if(last_lat !== undefined && last_lng !== undefined){
                 this.markers = {
                   markers:  [{
                     lat: last_lat,
                     lng: last_lng,
                     icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                     infoWindowOptions: {
                     content: this.property.property_entitiy_id
                     }
                   }],
                   //fitBounds: true,
                   }
               }
               this.options = {zoom: 9};
            }else{
             this.showData = false
             this.lat = 1
             this.lng = 1
             this.markers={
               markers:  [],
               //fitBounds: true,
               }
             this.options = {zoom: 1};
            }
        }
      }
      }
    
     handleChange(e) {
        //e.value is the new value (is index)
        this.index = e.value
        const _lat = this.dimensions[0].data[this.index].value
        const _lng = this.dimensions[1].data[this.index].value
        this.lat = _lat
        this.lng = _lng
                this.markers = {
                  markers:  [{
                    lat: _lat,
                    lng: _lng,
                    icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                    infoWindowOptions: {
                    content: this.property.property_entitiy_id
                    }
                  }],
                  //fitBounds: true,
                  }
                  this.options = {zoom: 9};
    }

    
    refresh() {
        this.ref = !this.ref
    }
}

  