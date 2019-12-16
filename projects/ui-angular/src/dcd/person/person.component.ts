import { Component, Inject, PLATFORM_ID, OnInit} from '@angular/core';
import {HttpClientService} from '../http-client.service'
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'dcd-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  name : string = ''
  subject:string = ''
  person_id : string = ''
  email : string = ''

  constructor(private service: HttpClientService,@Inject(PLATFORM_ID) private platformId: Object,) {
    if (isPlatformServer(this.platformId)) {
      console.log('Init User component server');
      } else {
       this.BrowserUniversalInit()
    }
  }
  ngOnInit(): void {
  }

  BrowserUniversalInit(){
  this.service.get('api/user').subscribe(
    data => {
      this.subject = data['sub']
      const userId = data['sub'].split('dcd:persons:')[1]
      this.person_id = userId
      this.email = userId
      this.service.get('api/persons/'+userId).subscribe(
        data => {
          this.name = data['person'].name
        }
      )
    }
  )
  }

}
