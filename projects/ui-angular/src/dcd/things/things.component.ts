import { Component, Inject, PLATFORM_ID, Input, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Thing, Property, PropertyType } from '../classes';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'dcd-things',
  templateUrl: './things.component.html',
  styleUrls: ['./things.component.css']
})
export class ThingsComponent implements OnInit {
  things: Thing[] = [];
  displayedColumns: string[] = ['name', 'type', 'settings'];
  display_property: boolean = false;
  property_picked: Property = new Property({});

  constructor(
    private router: Router,
    private service: HttpClientService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      console.log('Init Things component server');
    } else {
      this.BrowserUniversalInit();
    }
  }

  BrowserUniversalInit() {
    console.log('Init Home component browser');
    this.FillArrayThings();
  }

  FillArrayThings(): void {
    this.service.get('api/things').subscribe((data) => {
      data['things'].forEach((thing) => {
        this.service.get('api/things/' + thing.id).subscribe((data) => {
          this.things.push(new Thing(data['thing']));
        });
      });
    });
  }

  descriptionT(thing: Thing): string {
    if (thing.description) {
      return thing.description;
    } else {
      return 'No description available';
    }
  }

  descriptionP(property: Property): string {
    if (property.description) {
      return property.description;
    } else {
      return 'No description available';
    }
  }

  HasProperty(thing: Thing): boolean {
    return thing.properties.length > 0;
  }

  async setChild(property: Property) {
    this.property_picked = property;
  }

  showDialog_property(property: Property) {
    this.setChild(property).then(() => (this.display_property = true));
  }

  delete_thing(thing: Thing) {
    if (confirm('Delete ' + thing.name + ' ?')) {
      this.service.delete('api/things/' + thing.id).subscribe((data) => {
        window.location.reload(); //TODO make a reload req ?
      });
    }
  }

  delete_property(property: Property) {
    if (confirm('Delete ' + property.name + ' ?')) {
      this.service
        .delete(
          'api/things/' + property.entity_id + '/properties/' + property.id
        )
        .subscribe((data) => {
          window.location.reload(); //TODO make a reload req ?
        });
    }
  }

  nav_thing(thing: Thing) {
    this.router.navigate(['/page/thing'], {
      state: { data: thing.json() }
    });
  }

  add_thing(thing: Thing) {
    this.service.post('api/things', thing.json()).subscribe((data) => {
      const newthing: Thing = new Thing(data['thing']);
      this.things.push(newthing);
      const jwt: string = data['thing'].keys.jwt;
      this.openDialogJWT(newthing, jwt);
    });
  }

  openDialogJWT(thing: Thing, jwt: string): void {
    const dialogRef = this.dialog.open(DialogJWT, {
      width: '250px',
      data: { thing: thing, jwt: jwt }
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogAddThing(): void {
    const dialogRef = this.dialog.open(DialogAddThing, {
      width: '250px',
      data: { name: '', type: '', description: '', pem: '' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.add_thing(
          new Thing({
            name: result.name,
            type: result.type,
            description: result.description,
            pem: result.pem
          })
        );
      }
    });
  }

  add_property_thing: Thing;

  openDialogAddProperty(thing: Thing): void {
    this.add_property_thing = thing;
    const dialogRef = this.dialog.open(DialogAddProperty, {
      width: '250px',
      data: { name: '', type: '', description: '', thing: thing }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.add_property({
          name: result.name,
          type: result.type,
          description: result.description
        });
      }
    });
  }

  add_property(property: {}) {
    console.log('in the post service');
    console.log(this.add_property_thing.id);
    console.log(property);

    this.service
      .post(
        'api/things/' + this.add_property_thing.id + '/properties',
        property
      )
      .subscribe((data) => {
        this.add_property_to_things(
          data['property'].entityId,
          new Property(data['property'])
        );
      });
  }

  add_property_to_things(thing_id: string, property: Property) {
    this.things.forEach((t) => {
      if (thing_id == t.id) {
        t.properties.push(property);
        console.log(property);
      }
    });
  }

  export_data(property: Property) {
    this.service
      .getCSV(
        'api/things/' +
          property.entity_id +
          '/properties/' +
          property.id +
          '?from=0' +
          '&to=' +
          new Date().getTime() +
          '000'
      )
      .subscribe((data) => {
        console.log(data);
        this.exportToCsv(property.name, data);
      });
  }

  private exportToCsv(filename: string, rows: any) {
    if (!rows) {
      console.log('Undefined ' + rows);
      return;
    }

    const csvContent = rows['property'].values.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}

export interface DialogData {
  name: string;
  type: string;
  description: string;
  thing: Thing;
  jwt: string;
  pem: string;
}

// Dialog to add New Thing
@Component({
  selector: 'dialog-add-thing',
  template: `
    <h1 mat-dialog-title>Add Thing</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput [(ngModel)]="data.name" placeholder="Name" />
      </mat-form-field>
      <mat-form-field>
        <input matInput [(ngModel)]="data.type" placeholder="Type" />
      </mat-form-field>
      <mat-form-field>
        <input
          matInput
          [(ngModel)]="data.description"
          placeholder="Description"
        />
      </mat-form-field>
      <mat-form-field>
        <textarea
          rows="15"
          cols="70"
          matInput
          [(ngModel)]="data.pem"
          placeholder="Your public key starting with -----BEGIN PUBLIC KEY-----"
        ></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No Thanks</button>
      <button
        *ngIf="data.name && data.pem"
        mat-button
        [mat-dialog-close]="data"
        cdkFocusInitial
      >
        Create
      </button>
    </div>
  `
})
export class DialogAddThing {
  constructor(
    public dialogRef: MatDialogRef<DialogAddThing>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// Dialog show JWT or TOKEN
@Component({
  selector: 'dialog-add-jwt',
  template: `
    <h1 mat-dialog-title>{{ data.thing.name }} ({{ data.thing.id }})</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input
          matInput
          placeholder="JWT"
          type="text"
          [value]="data.jwt"
          #inputTarget
          readonly
        />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No Thanks</button>
      <button
        mat-button
        [ngxClipboard]="inputTarget"
        [mat-dialog-close]="data"
        cdkFocusInitial
      >
        Copy JWT
      </button>
    </div>
  `
})
export class DialogJWT {
  constructor(
    public dialogRef: MatDialogRef<DialogAddThing>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// Dialog to Add New Property
@Component({
  selector: 'dialog-add-property',
  template: `
    <h1 mat-dialog-title>Add Property to {{ data.thing.name }}</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput [(ngModel)]="data.name" placeholder="Name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Type</mat-label>
        <mat-select [(ngModel)]="data.type">
          <mat-option *ngFor="let type of GetPropertyType()" [value]="type">
            {{ type }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <input
          matInput
          [(ngModel)]="data.description"
          placeholder="Description"
        />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No Thanks</button>
      <button
        *ngIf="data.name && data.type"
        mat-button
        [mat-dialog-close]="data"
        cdkFocusInitial
      >
        Create
      </button>
    </div>
  `
})
export class DialogAddProperty {
  constructor(
    public dialogRef: MatDialogRef<DialogAddThing>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  GetPropertyType(): string[] {
    const res: string[] = [];
    for (var type in PropertyType) {
      res.push(type);
    }
    return res;
  }
}
