import { Component,Inject,PLATFORM_ID, OnInit } from '@angular/core';
import { Task, Resource, Milestone, HttpClientService } from '@datacentricdesign/ui-angular'
import {isPlatformServer} from "@angular/common";
import { DatePipe } from '@angular/common'

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  actor_entity_id :string

  display_task : boolean = false
  task_picked : Task = new Task({})

  tasks:Task[] = []

  now = new Date()

  properties_concerned : any[] = []
  actions = [
    {label: 'Accept', value: 'accepted', icon: 'fas fa-check'},
    {label: 'Refuse', value: 'refused', icon: 'fas fa-times'},
  ]

  new_shared_properties : string[] = []
  new_status : string

  done : boolean = false
  

  constructor(@Inject(
    PLATFORM_ID) private platformId: Object,
    private service: HttpClientService,
    private datepipe: DatePipe
  ) {}

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Task component server'); // host on the server 
        } else {
         this.BrowserUniversalInit()
      }
    }

BrowserUniversalInit(){
  this.service.get('api/user').subscribe(
    data => {
      this.actor_entity_id = data['sub'].split('dcd:persons:')[1]
    })
  
  this.service.get('api/tasks').subscribe(
    data1 => {
      data1['tasks'].subject_tasks.forEach(task_params => {
        const params_task = task_params
        console.log(task_params)
        this.service.get('api/tasks/'+params_task['id']+'/resources').subscribe(
          data2 => {
            console.log(data2)
            this.tasks.push(new Task(params_task,data2['resources']))
          })
      });
    })
}

getDate(n:number):Date{
  return new Date(n)
}

getLastStatus(task:Task):string{
  if(task){
    if(task.resources.length > 0){
      return task.resources[0].milestones[task.resources[0].milestones.length-1].status
    }else{
      return "unknow => there is an issue"
    }
  }else {
    return ""
  }
}

async setChild(task : Task){
  this.task_picked = task
  this.now = new Date()
  this.FillsharedProperties(task)
}

showDialog_Task(task : Task) {
    if(this.getLastStatus(task)=="unread"){
      const milestone_read = {
          shared_properties : task.resources[0].milestones[task.resources[0].milestones.length-1].shared_properties,
          status : "read"
      }
      this.service.post('api/tasks/'+task.id+'/resources/'+task.resources[0].id+'/milestones',milestone_read).subscribe(
        data => {
          console.log(data)
          if(data['success']==true){
            task.resources[0].milestones.push(new Milestone({
              timestamp : Date.now(),
              shared_properties : task.resources[0].milestones[task.resources[0].milestones.length-1].shared_properties,
              status : "read"
            }))
          }
        })
    }
    this.setChild(task).then(()=>this.display_task = true)  
}

FillsharedProperties(task:Task){
  this.properties_concerned = []
  this.done = false
  if(task.resources.length>0){
    for(let property_id of task.resources[0].milestones[0].shared_properties){
      this.properties_concerned.push({
        label : property_id,
        value : property_id
      })
      if(this.properties_concerned.length == task.resources[0].milestones[0].shared_properties.length){
        this.done = true
      }
    }
  }
}

AddMilestone(task:Task){
  if (confirm(this.getConfirmMessage())) {
    const milestone = {
      shared_properties : this.new_shared_properties,
      status : this.new_status
  }
  this.service.post('api/tasks/'+task.id+'/resources/'+task.resources[0].id+'/milestones',milestone).subscribe(
    data => {
      console.log(data)
      this.now = new Date()
      if(data['success']==true){
        task.resources[0].milestones.push(new Milestone({
          timestamp : Date.now(),
          shared_properties : this.new_shared_properties,
          status : this.new_status
        }))
      }
    })
  }
}

getConfirmMessage():string{
  if(this.new_shared_properties.length>0){
    if(this.new_status == "accepted"){
      return "Add a new milestone with "+this.new_shared_properties.join()+" "+this.new_status+ " ?"
    }else{
      return "Refuse to give any properties ?"
    }
  }else{
    return "Refuse to give any properties ?"
  }
}

}