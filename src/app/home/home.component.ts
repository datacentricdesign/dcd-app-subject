import { Component, Inject,PLATFORM_ID, OnInit} from '@angular/core';
import {isPlatformServer} from "@angular/common";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(@Inject(
    PLATFORM_ID) private platformId: Object
  ) {}

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Home component server'); // host on the server 
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      console.log('Init Home component browser')
    }
  }