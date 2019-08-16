import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {

  display_notification : boolean = false

  task_1 = new Task(
    'id1',
  'task1',
  ['LOCATION'],
  0,
  new Date().getTime(),
  "We wan't your location for a study",
  new Date(2019,1,1).getTime(),
  'actor_entity_id1'
  )

  task_2 = new Task(
    'id2',
  'task2',
  ['LOCATION','ACCELEROMETER'],
  new Date(2019,1,1).getTime(),
  new Date().getTime(),
  "We wan't your location & acceleromater for a study",
  new Date(2019,2,1).getTime(),
  'actor_entity_id2'
  )

  task_3 = new Task(
    'id3',
  'task3',
  ['THREE_DIMENSIONS'],
  new Date(2019,3,1).getTime(),
  new Date().getTime(),
  "We wan't your location for a study",
  new Date(2019,3,1).getTime(),
  'actor_entity_id1'
  )
  
    notifications : Notification[] = [
      new Notification(
        'notif-id1',
        this.task_1,
        'unread'),
      new Notification(
          'notif-id2',
          this.task_2,
          'read'),
      new Notification(
            'notif-id3',
          this.task_3,
            'accepted')
    ]

    notification_picked : Notification = new Notification('',this.task_1,'')

    async setChild(notification : Notification){
      this.notification_picked = notification
    }

    showDialog_Notification(notification : Notification) {
        this.setChild(notification).then(()=>this.display_notification = true)
        
    }



    constructor() {}

    ngOnInit(): void {}

}

export class Notification {

    id:string
    task : Task
    status :string
  
    constructor(id:string,task: Task,status:string,){
      this.id = id
      this.task = task
      this.status = status
    }
  }

  export class Task {

    id : string
    name: string;
    types:string[];
    from : number 
    to : number 
    description:string
    registred_at:number
    actor_entity_id : string
  
    constructor(
      id:string,
      name:string,
      types:string[],
      from:number,
      to:number,
      description:string,
      registred_at:number,
      actor_entity_id : string
      ){
      this.id = id
      this.name = name
      this.types = types
      this.from = from
      this.to = to
      this.description = description
      this.registred_at = registred_at
      this.actor_entity_id = actor_entity_id
    }

    getDate():Date{
      return new Date(this.registred_at)
    }

  }