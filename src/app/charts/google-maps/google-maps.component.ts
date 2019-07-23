import { Component,Input,SimpleChanges} from '@angular/core';
import {Property,Dimension} from '../../../classes'

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.css']
})

export class GoogleMapsComponent {

    @Input() property:Property
    @Input() dimensions: Dimension;
    @Input() apiKey: string;
    @Input() checked: boolean;

    lat: number
    lng: number
    options
    markers : {} = {markers:[],fitBounds:true}

    showData : boolean = false
    ref : boolean = true 
    index : number
    sliderSize:number = 0

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {

      if(!(changes.dimensions === undefined)){
        this.refresh()
        const val:Dimension[]  = changes.dimensions.currentValue
        if(this.checked){
          this.show_realtime(val)
        }else{
          this.show_manual(val)
        }
      }
      }
    
     handleChange(e) {
        //e.value is the new value (is index)
        this.index = e.value
    }

    
    refresh() {
        this.ref = !this.ref
    }

    show_realtime(val:Dimension[]){
      this.markers['markers']= []
      if(val.length>0){
        if(val[0].data.length>0){
          this.showData = true
          this.index = val[0].data.length-1
          const last_lat = val[0].data[this.index].value
          const last_lng = val[1].data[this.index].value

              this.lat = last_lat
              this.lng = last_lng
              if(last_lat !== undefined && last_lng !== undefined){
              this.markers={
                markers:  [
                  {
                    lat: last_lat,
                    lng: last_lng,
                    icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                    infoWindowOptions: {
                    content: this.property.property_entitiy_id +' '+val[0].data[this.index].name
                    }
                }
                ],
                fitBounds: false
                }
                this.options = {zoom: 9};
        }
      }
      else{
        this.showData = false
           this.lat = 1
           this.lng = 1
           this.markers={
             markers:  [],
             fitBounds: false
             }
           this.options = {zoom: 1};
      }
    }
    }

    show_manual(val:Dimension[]){
      this.markers['markers']= []
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

              this.markers['markers']

              if(last_lat !== undefined && last_lng !== undefined){
                  for(var i = 0; i <= val[0].data.length-1; i++){
                    this.markers['markers'].push({
                        lat: val[0].data[i].value,
                        lng: val[1].data[i].value,
                        icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                        infoWindowOptions: {
                        content: this.property.property_entitiy_id +' '+val[0].data[i].name
                        }
                    })
                  }

             }
             this.markers['fitBounds'] = true
             this.options = {zoom: 9};
          }else{
           this.showData = false
           this.lat = 1
           this.lng = 1
           this.markers={
             markers:  [],
             fitBounds: false
             }
           this.options = {zoom: 1};
          }
      }
    }
}

  