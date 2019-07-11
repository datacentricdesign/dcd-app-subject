import { Component, Inject, Optional,PLATFORM_ID, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Thing,Property,PropertyType,server_url } from '.../../../classes'

import { Router} from '@angular/router';


import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import {isPlatformServer} from "@angular/common";
import { stringify } from '@angular/compiler/src/util';


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
    @Optional() @Inject('token') protected token: string,
    public dialog: MatDialog
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

    add_thing(thing:Thing){
      this.http.post(server_url+'api/things?jwt='+true,thing.json())
      .toPromise().then(data => {
        const newthing : Thing  = new Thing({
          thing_id : data['thing'].id,
          thing_name : data['thing'].name,
          thing_description : data['thing'].description,
          thing_type : data['thing'].type,
          thing_properties : data['thing'].properties
        })
        this.things.push(newthing)
        const jwt : string = data['thing'].keys.jwt
        this.openDialogJWT(newthing,jwt)
      })
    }

    openDialogJWT(thing:Thing,jwt:string): void {
      const dialogRef = this.dialog.open(DialogJWT, {
        width: '250px',
        data: {thing:thing,jwt:jwt}
      });
  
      dialogRef.afterClosed().subscribe(result => {

      });
    }

    openDialogAddThing(): void {
      const dialogRef = this.dialog.open(DialogAddThing, {
        width: '250px',
        data: {name: '', type: '',description:''}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){this.add_thing(new Thing({
          thing_name : result.name,
          thing_type : result.type,
          thing_description : result.description
        }))}
      });
    }

    add_property_thing : Thing

    openDialogAddProperty(thing:Thing): void {
      this.add_property_thing = thing
      const dialogRef = this.dialog.open(DialogAddProperty, {
        width: '250px',
        data: {name: '', type: '',description:'',thing:thing}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){this.add_property(new Property({
          property_name : result.name,
          property_type : result.type,
          property_description : result.description
        }))}
      });
    }

    add_property(property:Property){
      this.http.post(server_url+'api/things/'+this.add_property_thing.thing_id+'/properties',property.json())
      .toPromise().then(data => {
        this.add_property_to_things(data['property'].entityId,new Property({
          property_id : data['property'].id,
          property_name : data['property'].name,
          property_description : data['property'].description,
          property_type : data['property'].type,
          property_dimensions : data['property'].dimensions,
          property_values : data['property'].values,
        }))
      })
    }

    add_property_to_things(thing_id:string,property:Property){
      this.things.forEach(t => {
        if(thing_id == t.thing_id){
          t.thing_properties.push(property)
        }
    })
    }
  
}

export interface DialogData {
  name: string;
  type:string;
  description:string;
  thing:Thing;
  jwt:string;
}

@Component({
  selector: 'dialog-add-thing',
  template: `
  <h1 mat-dialog-title>Add Thing</h1>
<div mat-dialog-content>
  <mat-form-field>
    <input matInput [(ngModel)]="data.name" placeholder="Name">
  </mat-form-field>
  <mat-form-field>
    <input matInput [(ngModel)]="data.type" placeholder="Type">
  </mat-form-field>
  <mat-form-field>
    <input matInput [(ngModel)]="data.description" placeholder="Description">
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button *ngIf = "data.name != '' && data.name != undefined " mat-button [mat-dialog-close]="data" cdkFocusInitial>Create</button>
</div>
`
})
export class DialogAddThing {

  constructor(
    public dialogRef: MatDialogRef<DialogAddThing>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-add-property',
  template: `
  <h1 mat-dialog-title>Add Property to {{data.thing.thing_name}}</h1>
<div mat-dialog-content>
  <mat-form-field>
    <input matInput [(ngModel)]="data.name" placeholder="Name">
  </mat-form-field>
  <mat-form-field>
  <mat-label>Type</mat-label>
  <mat-select [(ngModel)]="data.type">
    <mat-option *ngFor="let type of GetPropertyType()" [value]="type">
      {{type}}
    </mat-option>
  </mat-select>
</mat-form-field>
  <mat-form-field>
    <input matInput [(ngModel)]="data.description" placeholder="Description">
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button *ngIf = "data.name != '' && data.name != undefined && data.type != '' && data.type != undefined " mat-button [mat-dialog-close]="data" cdkFocusInitial>Create</button>
</div>
`
})
export class DialogAddProperty {

  constructor(
    public dialogRef: MatDialogRef<DialogAddThing>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  GetPropertyType():string[]{
    const res : string[] = []
    for(var type in PropertyType) {
      res.push(type)
    }
    return res
  }

}


@Component({
  selector: 'dialog-add-jwt',
  template: `
  <h1 mat-dialog-title>JWT {{data.thing.thing_name}}</h1>
  <div mat-dialog-content>
  <mat-form-field>
    <input matInput type="text"[value]="data.jwt"  #inputTarget readonly>
  </mat-form-field>
  </div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button mat-button [ngxClipboard]="inputTarget" [mat-dialog-close]="data" cdkFocusInitial>Copy</button>
</div>
  `
})
export class DialogJWT {

  constructor(
    public dialogRef: MatDialogRef<DialogAddThing>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
