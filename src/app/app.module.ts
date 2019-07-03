import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

//Components
import {  AppComponent  } from './app.component';
import {  HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component'
import { NotificationsComponent } from './notifications/notifications.component'
import {  NavbarComponent } from './navbar/navbar.component'
import { PropertyComponent } from './property/property.component'
import {UserComponent} from './user/user.component'
import { ThingComponent } from "./thing/thing.component";

//Http
import { ClientService } from './client.service';
import {  HttpClientModule  } from '@angular/common/http';
import {  TransferHttpCacheModule } from '@nguniversal/common';

// MatUI
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';

//PrimeNG
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';

// Google Maps
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'

// Ng2 charts
import { ChartsModule } from 'ng2-charts';

//Href

import { APP_BASE_HREF} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotificationsComponent,
    NavbarComponent,
    PropertyComponent,
    UserComponent,
    ThingComponent
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
    SliderModule
    
  ],
  providers: [
    ClientService,
    //{ provide: APP_BASE_HREF, useValue: '/subject/' },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}