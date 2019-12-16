import { Component, Input, OnInit,SimpleChanges,IterableDiffers,IterableDiffer} from '@angular/core';
import {Thing, Property} from '../classes'
import { Router } from '@angular/router';

@Component({
  selector: 'dcd-data-types',
  templateUrl: './data-types.component.html',
  styleUrls: ['./data-types.component.css']
})
export class DataTypesComponent implements OnInit {

  @Input() properties : Property[];
  str_things : Thing[] = []
  display_property: boolean = false;
  property_picked:Property = new Property({})

  private differ: IterableDiffer<Property>;

  constructor(private differs: IterableDiffers, private router: Router) {
    this.differ = this.differs.find([]).create(null);
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    if (this.differ) {
      const changes = this.differ.diff(this.properties)
      if(changes){
      if(changes['collection']){
      this.str_things = []
      changes['collection'].forEach(property=>{
        this.AddType(this.str_things,property)
      })
      }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  if(changes.properties){
    this.str_things = []
    changes.properties.currentValue.forEach(property=>{
      this.AddType(this.str_things,property)
    })
  }
}

  AddType(str_things : Thing[],property:Property){
    if(this.contains(str_things,property.type)){
      str_things.forEach(str_thing => {
        if (str_thing.name == property.type){
          str_thing.properties.push(property)
        }
    })
    }else{
      const new_thing = new Thing({
        name : property.type,
        type : property.type,
        description : property.type,
        //properties : [property]
      })
      new_thing.properties.push(property)
      str_things.push(new_thing)
    }
  }

  contains(str_things : Thing[],thing_name_or_property_type:string):boolean{
    for (var i = 0; i <= str_things.length; i ++) {
      if(i < str_things.length){
          if(thing_name_or_property_type == str_things[i].name){
              return true
          }
      }else{
          return false
      }
    }
  }

  descriptionT(thing:Thing):string {
    if(thing.description){
      return thing.description
    }else{
      return 'No description available'
    }
  }
  descriptionP(property:Property):string {
    if(property.description){
      return property.description
    }else{
      return 'No description available'
    }
  }

  HasProperty(thing:Thing):boolean{
    return thing.properties.length > 0
  }

  async setChild(property : Property){
    this.property_picked = property
  }

  showDialog_property(property : Property) {
      this.setChild(property).then(()=>this.display_property = true)

  }

  nav_thing(thing:Thing){
    this.router.navigate(['/page/thing'], {
      state:{data:thing.json()}});
  }

}
