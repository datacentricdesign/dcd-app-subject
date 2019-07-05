import {Component} from '@angular/core';
import {server_url } from '.../../../classes'

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import {Inject} from '@angular/core';
import { PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})



export class NavbarComponent {

  name : string = ''
  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,) {
    if (isPlatformServer(this.platformId)) {
      } else {
       this.BrowserUniversalInit()
    }
  }

  BrowserUniversalInit(){
  this.http.get(server_url+'api/user')
  .toPromise().then(data => {
  const userId = data['sub'].split('dcd:persons:')[1]
  this.http.get(server_url+'api/persons/'+userId)
  .toPromise().then(data => {
  this.name =data['person'].name
  });
  });

  }
    
}
