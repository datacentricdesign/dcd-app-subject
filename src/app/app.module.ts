import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';

//Http
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

// MatUI
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material';

//prime-ng
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

//@datacentricdesign/ui-angular
import { UiAngularModule } from '../app/dcd/ui-angular.module';

//To DELETE
/*import {HttpClientService} from './http-client.service'*/

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotificationsComponent,
    NavbarComponent,
    UserComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'page/home', component: HomeComponent, pathMatch: 'full' },
      { path: 'page/user', component: UserComponent, pathMatch: 'full' },
      {
        path: 'page/notifications',
        component: NotificationsComponent,
        pathMatch: 'full'
      },
      { path: '**', redirectTo: '/page/home', pathMatch: 'full' }
    ]),
    TransferHttpCacheModule,
    MatButtonModule,
    HttpClientModule,
    UiAngularModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ButtonModule,
    DialogModule
  ],
  providers: [
    //HttpClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
