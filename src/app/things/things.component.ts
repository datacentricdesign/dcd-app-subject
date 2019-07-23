import { Component, Inject,PLATFORM_ID, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Thing,Property,PropertyType} from '../../classes'
import { Router} from '@angular/router';
import {HttpClientService} from '../httpclient.service'
import {isPlatformServer} from "@angular/common";

@Component({
    selector: 'app-things',
    templateUrl: './things.component.html',
    styleUrls: ['./things.component.css']
})
export class ThingsComponent implements OnInit {

  things : Thing[] = []
  displayedColumns: string[] = ['name', 'type', 'settings'];
  //Dialog property
  display_property: boolean = false;
  property_picked:Property = new Property({})

  constructor(
    private router: Router,
    private service: HttpClientService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog
  ) {
  
    }

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Things component server'); 
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      this.FillArrayThings(this.things) 
    }

    FillArrayThings(things : Thing[]) : void{
      this.service.get('api/things').subscribe(
        data => {
        data['things'].forEach(thing => {
          this.service.get('api/things/'+thing.id).subscribe(
        data => {
        things.push(new Thing(data['thing']))
        });
      });
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

    async setChild(property : Property){
      this.property_picked = property
    }

    showDialog_property(property : Property) {
        this.setChild(property).then(()=>this.display_property = true)
        
    }

    delete_thing(thing:Thing){
      if ( confirm( "Delete " + thing.thing_name +" ?" ) ) {
       this.service.delete('api/things/'+thing.thing_id).subscribe(
       data => {
         window.location.reload(); //TODO make a reload req ?
       })
    }
    }

    delete_property(property:Property){
      if ( confirm( "Delete "+property.property_name+" ?" ) ) {
        this.service.delete('api/things/'+property.property_entitiy_id+'/properties/'+property.property_id).subscribe(
        data => {
         window.location.reload(); //TODO make a reload req ?
       })
     }
    }

    nav_thing(thing:Thing){
      this.router.navigate(['/page/thing'], {
        state:{data:thing.json()}});
    }

    add_thing(thing:Thing){
      this.service.post('api/things?jwt='+true,thing.json()).subscribe(
        data => {
        const newthing : Thing  = new Thing(data['thing'])
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
          name : result.name,
          type : result.type,
          description : result.description
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
          name : result.name,
          type : result.type,
          description : result.description
        }))}
      });
    }

    add_property(property:Property){
      this.service.post('api/things/'+this.add_property_thing.thing_id+'/properties',property.json()).subscribe(
        data => {
        this.add_property_to_things(data['property'].entityId,new Property(data['property']))
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
