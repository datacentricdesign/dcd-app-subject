import { Component, OnInit, ElementRef } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import {Inject, Optional} from '@angular/core';
import { PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})



export class NavbarComponent {

  name : string ='test'
  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object,) {
    if (isPlatformServer(this.platformId)) {
      } else {
       this.BrowserUniversalInit()
    }
  }

  BrowserUniversalInit(){
    this.http.get('api/user')
  // this.http.get('http://localhost:8080/api/user')
  .toPromise().then(data => {
  console.log('promise0',data)
  const userId = data['sub'].split('dcd:persons:')[1]
  this.http.get('api/persons/'+userId)
  // this.http.get('http://localhost:8080/api/persons/'+userId)
  .toPromise().then(data => {
  console.log('promise0',data)
  this.name =data['person'].name
  });

  });

  }
    
}
