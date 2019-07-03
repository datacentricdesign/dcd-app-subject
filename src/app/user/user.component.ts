import { Component, Inject, Optional,PLATFORM_ID, OnInit} from '@angular/core';

import {isPlatformServer} from "@angular/common";

@Component({
    //changeDetection: ChangeDetectionStrategy.Default,
    //encapsulation: ViewEncapsulation.Emulated,
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit{

    constructor(
        //private service: ClientService, 
        //private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
      ) {
        }

    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) {
            console.log('Home component server :'); // host on the server  
            } else {
             this.BrowserUniversalInit()
          }
    }

    BrowserUniversalInit(){
      }

}