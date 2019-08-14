import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

//Components
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {NotificationsComponent} from './notifications/notifications.component';
import { NavbarComponent} from './navbar/navbar.component';
import {UserComponent} from './user/user.component';

//Http
import {HttpClientModule} from '@angular/common/http';
import {TransferHttpCacheModule} from '@nguniversal/common';

// MatUI
import {MatButtonModule} from '@angular/material/button';

//@datacentricdesign/ui-angular
import {UiAngularModule} from '@datacentricdesign/ui-angular';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotificationsComponent,
    NavbarComponent,
    UserComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path : 'page/home', component : HomeComponent, pathMatch: 'full' },
      {path : 'page/user', component : UserComponent, pathMatch: 'full' },
      {path : 'page/about', component : AboutComponent, pathMatch: 'full'},
      {path : 'page/notifications', component : NotificationsComponent, pathMatch: 'full'},
      {path : '**',redirectTo: '/page/home',pathMatch: 'full'},
    ]),
    TransferHttpCacheModule,
    MatButtonModule,
    HttpClientModule,
    UiAngularModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }