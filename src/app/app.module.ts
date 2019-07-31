import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DcdUiAngularModule} from 'dcd-ui-angular';

//Components
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ThingsComponent, DialogAddThing, DialogAddProperty, DialogJWT} from './things/things.component'
import {AboutComponent} from './about/about.component';
import {NotificationsComponent} from './notifications/notifications.component';
import { NavbarComponent} from './navbar/navbar.component';
import {PropertyComponent} from './property/property.component';
import {UserComponent} from './user/user.component';
import {ThingComponent} from "./thing/thing.component";
import {DoubleAxisChartComponent} from './charts/double-axis-chart/double-axis-chart.component';
import {DoubleDimensionChartComponent} from './charts/double-dimension-chart/double-dimension-chart.component';
import {GoogleMapsComponent} from './charts/google-maps/google-maps.component';
import {RadarChartComponent} from './charts/radar-chart/radar-chart.component'

//Http
import {HttpClientModule} from '@angular/common/http';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {HttpClientService} from './httpclient.service'

// MatUI
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

//PrimeNG
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';

//Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Google Maps
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'

// Ng2 charts
import { ChartsModule } from 'ng2-charts';

//ngx charts 
import { NgxChartsModule } from '@swimlane/ngx-charts';

//ngx clipboard 
import { ClipboardModule } from 'ngx-clipboard';
import {LineChartComponent} from 'dcd-ui-angular';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotificationsComponent,
    NavbarComponent,
    PropertyComponent,
    UserComponent,
    ThingComponent,
    DoubleAxisChartComponent,
    DoubleDimensionChartComponent,
    GoogleMapsComponent,
    LineChartComponent,
    RadarChartComponent,
    ThingsComponent,

    DialogAddThing,
    DialogAddProperty,
    DialogJWT

    
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    RouterModule.forRoot([
      {path : 'page/home', component : HomeComponent, pathMatch: 'full' },
      {path : 'page/user', component : UserComponent, pathMatch: 'full' },
      {path : 'page/about', component : AboutComponent, pathMatch: 'full'},
      {path : 'page/notifications', component : NotificationsComponent, pathMatch: 'full'},
      {path : 'page/thing',component : ThingComponent, pathMatch : 'full'},
      {path : '**',redirectTo: '/page/home',pathMatch: 'full'},
    ]),
    TransferHttpCacheModule,
    MatButtonModule,
    HttpClientModule, //VERY IMPORTANT
    MatTableModule,
    DialogModule,
    BrowserAnimationsModule,
    ChartsModule,
    FormsModule,
    CalendarModule,
    SliderModule,
    NgxChartsModule,
    NgbModule,
    CheckboxModule,
    InputTextModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    ClipboardModule,
    MatSlideToggleModule,
      DcdUiAngularModule
    
    
  ],
  providers: [
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    DialogAddThing,
    DialogAddProperty,
    DialogJWT
  ]
})
export class AppModule { }

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
