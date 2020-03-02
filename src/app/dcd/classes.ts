export class Person {
    id: string;
    name: string;
    password: string;
    properties: any;

    constructor(
        id:string,
        name:string,
        password:string,
        properties:any,
        ) {
        this.id = id
        this.name = name
        this.password = password
        this.properties = properties
    }

    to_json():{}{
        return{
            id:this.id,
            name:this.name,
            password:this.password,
            properties:this.properties
        }
    }
}

export class Thing {
    id: string;
    token: string;
    name: string;
    description: string;
    type: string
    pem: string
    properties: Property[] = [];

   constructor(params : {}) {
       if(!params){
           throw new TypeError('Thing : constructor param is undefined or null')
       }else{
       this.id = params['id']
       this.token = params['token']
       this.name = params['name']
       this.description = params['description']
       this.type = params['type']

       if (params['pem'] !== undefined) {
         this.pem = params['pem']
       }

       if(params['properties'] instanceof Array){
        params['properties'].forEach(property => {
            if(property instanceof Property){
                this.properties.push(property)
            }else{
                if(property.constructor === {}.constructor){
                    this.properties.push(new Property({
                        entity : this,
                        id : property['id'],
                        name : property['name'],
                        description : property['description'],
                        type : property['type'],
                        dimensions : property['dimensions'],
                        values : property['values'],
                        entityId : property['entityId']
                    }
                    ))
                }
            }
        })
    }
   }
   }

   json():{}{
       return {
       id : this.id,
       name : this.name,
       type : this.type,
       pem : this.pem,
       description: this.description,
       properties : this.properties_to_array()
       }
   }



   private properties_to_array():Array<any>{
       var res = []
       for (var i = 0; i <= this.properties.length; i ++) {
           if(i < this.properties.length){
               const property = this.properties[i]
               res.push(property.json())
           }else{
               return res
           }
         }
   }

   update_properties(properties:Array<Property>){
    properties.forEach(property => {
                if(!this.contains(property.id)){
                    this.properties.push(property)
                }else{
                    console.log(property.id,'already there')
                }
    })
}

    contains(property_id:string):boolean{
    for (var i = 0; i <= this.properties.length; i ++) {
        if(i < this.properties.length){
            if(property_id == this.properties[i].id){
                return true
            }
        }else{
            return false
        }
      }
}

}

export class Property {
    id: string;
    name: string;
    description: string;
    type: string;
    dimensions: any[] = [];
    values: any[] = [];
    entity_id:string;
    classes:string[];


    constructor(params : {}) {
        if(!params){
            throw new TypeError('Property : constructor param is undefined or null')
        }else{
            this.id = params['id']
            this.name = params['name']
            this.description = params['description']
            this.type = params['type'];
            this.setDimension(params['dimensions']);
            if(params['values']){
            this.values = params['values'];
            }
            this.entity_id = params ['entityId']
          this.classes = params['classes']
        }
    }

    json(){
        return {
            id : this.id,
            name : this.name,
            type : this.type,
            description: this.description,
            dimensions: this.dimensions,
            values : this.values,
            entityId : this.entity_id
        }
    }

    getDimArratName():string[]{
        var array :  string[] = []
        for(var i = 0; i <= this.dimensions.length; i++){
            if(i == this.dimensions.length){
                return array
              }else{
                  array.push(this.dimensions[i].name)
              }
        }
    }

    setDimension(param:any){
    if(!param){
        this.dimensions = []
    }else{
        if(param instanceof Array){
            param.forEach(p => {
                if(this.dimensions.length>0){
                    const array_name = this.getDimArratName()
                    if(!array_name.includes(p.name)){
                        this.dimensions.push(p)
                      }
                }else{
                    this.dimensions.push(p)
                }
            })
        }
    }
    }
}

export enum PropertyType{
    ONE_DIMENSION = "ONE_DIMENSION",
    TWO_DIMENSIONS = "TWO_DIMENSIONS",
    THREE_DIMENSIONS = "THREE_DIMENSIONS",
    FOUR_DIMENSIONS = "FOUR_DIMENSIONS",
    FIVE_DIMENSIONS = "FIVE_DIMENSIONS",
    SIX_DIMENSIONS = "SIX_DIMENSIONS",
    SEVEN_DIMENSIONS = "SEVEN_DIMENSIONS",
    EIGHT_DIMENSIONS = "EIGHT_DIMENSIONS",
    NINE_DIMENSIONS = "NINE_DIMENSIONS",
    TEN_DIMENSIONS = "TEN_DIMENSIONS",
    ELEVEN_DIMENSIONS = "ELEVEN_DIMENSIONS",
    TWELVE_DIMENSIONS = "TWELVE_DIMENSIONS",
    ACCELEROMETER = "ACCELEROMETER",
    GYROSCOPE = "GYROSCOPE",
    BINARY = "BINARY",
    MAGNETIC_FIELD = "MAGNETIC_FIELD",
    GRAVITY = "GRAVITY",
    ROTATION_VECTOR = "ROTATION_VECTOR",
    LIGHT = "LIGHT",
    LOCATION = "LOCATION",
    ALTITUDE = "ALTITUDE",
    BEARING = "BEARING",
    SPEED = "SPEED",
    PRESSURE = "PRESSURE",
    PROXIMITY = "PROXIMITY",
    RELATIVE_HUMIDITY = "RELATIVE_HUMIDITY",
    COUNT = "COUNT",
    FORCE = "FORCE",
    TEMPERATURE = "TEMPERATURE",
    STATE = "STATE",
    VIDEO = "VIDEO",
    CLASS = "CLASS"
}

export class DataCollection{
    from :number
    to :number
    properties : Property[]

    constructor(from:number,to:number,properties : Property[]){
        this.from = from
        this.to = to
        this.properties = properties
    }

    contains(property_id:string):boolean{
        for (var i = 0; i <= this.properties.length; i ++) {
            if(i < this.properties.length){
                if(property_id == this.properties[i].id){
                    return true
                }
            }else{
                return false
            }
          }
    }
}

export class Dimension {

    property_id : string
    property_name : string
    dimension : string
    unit :string
    data : {value:number,name:Date}[] = []

    constructor(property_id,property_name:string,dimension:string,unit:string,data: {value:number,name:Date}[]){
        this.property_id = property_id
        this.property_name = property_name
        this.dimension=dimension
        this.unit=unit
        this.data = data
    }

    static getData(index,values:any[]): {value:number,name:Date}[]{
        var array :  {value:number,name:Date}[] = []
        for(var i = 0; i <= values.length; i++){
          if(i == values.length){
            return array
          }else{
              array.push(
                {
                  value: values[i][index+1],
                  name: new Date(values[i][0])
                }
              )
          }
        }
      }
}

export class Task {

    id : string
    name: string;
    types:string[];
    from : number
    to : number
    description:string
    registered_at:number
    actor_entity_id : string

    resources : Resource[] = []

    constructor(params:{},resources:any[] = undefined){
        if(!params){
            throw new TypeError('Task : constructor param is undefined or null')
        }else{
            this.id = params['id']
            this.name = params['name']
            this.description = params['description']
            this.from = params['from']
            this.to = params['to']
            this.registered_at = params['registeredAt']
            this.actor_entity_id = params['actorEntityId']

            if(params['types'] instanceof Array){
                this.types = params['types']
            }else if(params['types'] instanceof String){
                this.types = params['types'].split(',')
            }else{
                this.types = []
            }

            if(resources){
                if(resources instanceof Array){
                    resources.forEach(resource => {
                        if(resource instanceof Resource){
                            this.resources.push(resource)
                        }else{
                            this.resources.push(new Resource(resource))
                        }
                    })
                }
            }
        }
    }

    json(){
        return {
            name: this.name,
            description: this.description,
            types: this.types,
            from : this.from,
            to : this.to,
            actor_entity_id : this.actor_entity_id
        }
    }

    getDate():Date{
    return new Date(this.registered_at)
    }

}

export class Resource {

    id : string
    task_id: string;
    milestones:Milestone[] = []

    constructor(params:{}){
        if(!params){
            throw new TypeError('Resource : constructor param is undefined or null')
        }else{
            this.id = params['id']
            this.task_id = params['taskId']

            if(params['milestones'] instanceof Array){
                params['milestones'].forEach(milestone => {
                    if(milestone instanceof Milestone){
                        this.milestones.push(milestone)
                    }else{
                        if(milestone.constructor === {}.constructor){
                            this.milestones.push(new Milestone(milestone))
                        }
                    }
                })
            }
        }
    }
}

export class Milestone {

    timestamp : number
    shared_properties : string[]
    status : string

    constructor(params:{}){
        if(!params){
            throw new TypeError('Milestone : constructor param is undefined or null')
        }else{
            this.timestamp = params['timestamp']
            this.status = params['status']
            if(params['shared_properties'] instanceof Array){
                this.shared_properties = params['shared_properties']
            }else if(typeof params['shared_properties'] === 'string' || params['shared_properties'] instanceof String){
                this.shared_properties = params['shared_properties'].split(',')
            }else{
                this.shared_properties = []
            }
        }
    }

}
