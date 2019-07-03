import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformServer } from "@angular/common";
import { Router} from '@angular/router';
import { Thing,Property } from '.../../../classes'

@Component({
    //changeDetection: ChangeDetectionStrategy.Default,
    //encapsulation: ViewEncapsulation.Emulated,
    selector: 'app-thing',
    templateUrl: './thing.component.html',
    styleUrls: ['./thing.component.css']
})
export class ThingComponent implements OnInit {

    thing : Thing

    constructor(
        private router: Router,
        //private service: ClientService, 
        //private http: HttpClient,
        @Inject(PLATFORM_ID)
        private platformId: Object) {
    }
    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) {
            console.log('Home component server :'); // host on the server  
        }
        else {
            console.log(history.state.data)
            if(history.state.data === undefined){
                this.router.navigate(['/subject/page/home'])
            }else{
                this.thing = new Thing({
                    thing_id : history.state.data.id,
                    thing_name : history.state.data.id,
                    thing_type : history.state.data.type,
                    thing_description : history.state.data.description,
                    thing_properties : history.state.data.properties
                })
                this.BrowserUniversalInit();
            }
        }
    }
    BrowserUniversalInit() {
        console.log(this.thing)
    }
}
