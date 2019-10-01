import {Component, OnInit} from '@angular/core';
import {HttpClientService} from '@datacentricdesign/ui-angular';
import {Inject} from '@angular/core';
import {PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

    name: string = '';
    subject: string;

    constructor(private service: HttpClientService, @Inject(PLATFORM_ID) private platformId: Object,) {
        if (isPlatformServer(this.platformId)) {
            console.log('Init Navbar component server');
        } else {
            this.BrowserUniversalInit();
        }
    }

    ngOnInit(): void {
    }

    BrowserUniversalInit() {
        this.service.get('api/user').subscribe(
            data => {
                this.subject = data['sub'];
                const userId = data['sub'].split('dcd:persons:')[1];
                this.service.get('api/persons/' + userId).subscribe(
                    data => {
                        this.name = data['person'].name;
                    }
                );
            }
        );
    }

    logout() {
        window.location.assign('logout');
    }

}
