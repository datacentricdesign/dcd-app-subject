import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

//@angular/material
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';

//prime-ng
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

//Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//ng2-charts
import { ChartsModule } from 'ng2-charts';
import { PropertyOneDimensionComponent } from './property-one-dimension/property-one-dimension.component';

//@swimlane/ngx-charts
import { NgxChartsModule } from '@swimlane/ngx-charts';

//ngx-clipboard
import { ClipboardModule } from 'ngx-clipboard';

//Google Maps
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//Http
import { HttpClientModule } from '@angular/common/http';

//Vertical timeline
import { VerticalTimelineModule } from 'angular-vertical-timeline';

//Components
import { UiAngularComponent } from './ui-angular.component';
import { DoubleAxisChartComponent } from './double-axis-chart/double-axis-chart.component';
import { PropertyXDimensionsComponent } from './property-x-dimensions/property-x-dimensions.component';
import { PropertyTwoDimensionsComponent } from './property-two-dimensions/property-two-dimensions.component';
import { PropertyLocationComponent } from './property-location/property-location.component';
import { PropertyComponent } from './property/property.component';
import { PropertyVideoComponent } from './property-video/property-video.component';
import { PropertyClassComponent } from './property-class/property-class.component';
import { PropertyTextComponent } from './property-text/property-text.component';
import { PersonComponent } from './person/person.component';
import { ThingComponent } from './thing/thing.component';
import {
  ThingsComponent,
  DialogAddThing,
  DialogAddProperty,
  DialogJWT,
  DialogAddPem
} from './things/things.component';
import { DataCollectionsComponent } from './data-collections/data-collections.component';
import { SearchComponent } from './search/search.component';
import { DataTypesComponent } from './data-types/data-types.component';

@NgModule({
  declarations: [
    UiAngularComponent,
    DoubleAxisChartComponent,
    PropertyOneDimensionComponent,
    PropertyTwoDimensionsComponent,
    PropertyXDimensionsComponent,
    PropertyLocationComponent,
    PropertyVideoComponent,
    PropertyClassComponent,
    PropertyTextComponent,
    PropertyComponent,
    ThingComponent,
    ThingsComponent,
    DialogAddThing,
    DialogAddProperty,
    DialogJWT,
    DialogAddPem,
    DataCollectionsComponent,
    SearchComponent,
    PersonComponent,
    DataTypesComponent,
    PropertyTextComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: 'page/thing', component: ThingComponent, pathMatch: 'full' }
    ]),
    SliderModule,
    ChartsModule,
    NgxChartsModule,
    ClipboardModule,
    HttpClientModule,
    MatSlideToggleModule,
    DialogModule,
    CalendarModule,
    MatButtonModule,
    CheckboxModule,
    MatButtonModule,
    InputTextModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    NgbModule,
    FormsModule,
    VerticalTimelineModule,
    MatProgressBarModule
  ],
  exports: [
    UiAngularComponent,
    PropertyOneDimensionComponent,
    PropertyTwoDimensionsComponent,
    PropertyXDimensionsComponent,
    PropertyLocationComponent,
    PropertyTextComponent,
    PropertyComponent,
    ThingComponent,
    ThingsComponent,
    DataTypesComponent,
    DataCollectionsComponent,
    SearchComponent,
    PropertyVideoComponent,
    PropertyClassComponent,
    PersonComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [DialogAddThing, DialogAddProperty, DialogJWT, DialogAddPem],
  providers: [DatePipe]
})
export class UiAngularModule {}
