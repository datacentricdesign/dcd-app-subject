import { Component, Inject, Optional,PLATFORM_ID, OnInit} from '@angular/core';

import { Thing,Property,server_url } from '.../../../classes'

import { Router} from '@angular/router';


import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import {isPlatformServer} from "@angular/common";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  things : Thing[] = []
  displayedColumns: string[] = ['name', 'type', 'settings'];
  //Dialog property
  display_property: boolean = false;
  thing_picked:Thing = new Thing ({thing_id:'test'})
  property_picked:Property = new Property({})

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('serverUrl') protected serverUrl: string,
    @Optional() @Inject('token') protected token: string
  ) {
    }

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Home component server :', this.token,this.serverUrl); // host on the server  
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      this.FillArrayThings(this.things) 
    }

    FillArrayThings(things : Thing[]) : void{
      this.http.get(server_url+'api/things')
      .toPromise().then(data => {
        data['things'].forEach(thing => {
          this.http.get(server_url+'api/things/'+thing.id)
        .toPromise().then(data => {
        things.push(new Thing({
          thing_id : data['thing'].id,
          thing_name : data['thing'].name,
          thing_description : data['thing'].description,
          thing_type : data['thing'].type,
          thing_properties : data['thing'].properties
        }))
        });
      });
    }).catch(err => {
      console.log('Error FillArray', err);
    })
    ;
    }

    sort_things_by_properties(things : Thing[]) : Thing[] {

      return []
    }

    descriptionT(thing:Thing):string {
      if(thing.thing_description == "" || thing.thing_description === undefined){
        return 'No description available'
      }else{
        return thing.thing_description
      }
    }

    descriptionP(property:Property):string {
      if(property.property_description == "" || property.property_description === undefined ){
        return 'No description available'
      }else{
        return property.property_description 
      }
    }

    HasProperty(thing:Thing):boolean{
      return thing.thing_properties.length > 0
    }

    async setChild(thing : Thing,property : Property){
      this.thing_picked = thing
      this.property_picked = property
    }

    showDialog_property(thing : Thing,property : Property) {
        this.setChild(thing,property).then(()=>this.display_property = true)
        
    }

    delete_thing(thing:Thing){
      if ( confirm( "Delete " + thing.thing_name +" ?" ) ) {
       this.http.delete(server_url+'api/things/'+thing.thing_id)
       .toPromise().then(data => {
         window.location.reload(); //TODO make a reload req ?
       })
    }
    }

    delete_property(thing:Thing,property:Property){
      if ( confirm( "Delete "+property.property_name+" ?" ) ) {
        this.http.delete(server_url+'api/things/'+thing.thing_id+'/properties/'+property.property_id)
       .toPromise().then(data => {
         window.location.reload(); //TODO make a reload req ?
       })
     }
    }

    nav_thing(thing:Thing){
      this.router.navigate(['/page/thing'], {
        state:{data:thing.json()}});
    }
 
  
}
