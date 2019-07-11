//export { Person,Thing,Property,PropertyType  } from 'dcd-sdk-js'
//export const dcd = require('dcd-sdk-js')

//export const server_url = "http://localhost:8080/subject/"
export const server_url = ""

export class Person {
    person_id: string;
    person_name: string;
    person_password: string;
    person_properties: any;

    constructor(
        person_id:string,
        person_name:string,
        person_password:string,
        person_properties:any,
        ) {
        this.person_id = person_id
        this.person_name = person_name
        this.person_password = person_password
        this.person_properties = person_properties
    }
    
    to_json():{}{
        return{
            id:this.person_id,
            name:this.person_name,
            password:this.person_password,
            properties:this.person_properties
        }
    }
}


export class Property {
    property_id: string;
    property_name: string;
    property_description: string;
    property_type: string;
    property_dimensions: any[] = [];
    property_values: any[] = [];


    constructor(params : {}) {
            this.property_id = params['property_id']
            this.property_name = params['property_name']
            this.property_description = params['property_description']
            this.property_type = params['property_type'];
            this.property_dimensions = params['property_dimensions'];
            this.property_values = params['property_values'];
    }

    json(){
        return {
            id : this.property_id,
            name : this.property_name,
            type : this.property_type,
            description: this.property_description,
            dimensions: this.property_dimensions,
            value : this.property_values
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


export class Thing {
    thing_id: string;
    thing_token: string;
    thing_name: string;
    thing_description: string;
    thing_type: string
    thing_properties: Property[] = [];
   
   constructor(params : {}) {
       if(params === undefined){
           throw new TypeError('Thing : constructor param is undefined')
       }else{
       this.thing_id = params['thing_id']
       this.thing_token = params['thing_token']
       this.thing_name = params['thing_name']
       this.thing_description = params['thing_description']
       this.thing_type = params['thing_type']
       
       if(params['thing_properties'] instanceof Array){
           params['thing_properties'].forEach(property => {
               if(property instanceof Property){
                   this.thing_properties.push(property)
               }else{
                   if(property.constructor === {}.constructor){
                       this.thing_properties.push(new Property({
                           property_id :property['id'],
                           property_name : property['name'],
                           property_description : property['description'],
                           property_type : property['type'],
                           property_dimensions : property['dimensions'],
                           property_values : property['values']
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
       id : this.thing_id,
       name : this.thing_name,
       type : this.thing_type,
       description: this.thing_description,
       properties : this.properties_to_array()
       }
   }



   private properties_to_array():Array<any>{
       var res = []
       for (var i = 0; i <= this.thing_properties.length; i ++) {
           if(i < this.thing_properties.length){
               const property = this.thing_properties[i]
               res.push(property.json())
           }else{
               return res
           }
         }
   }

}

export class Dimension {

    property_name : string
    dimension : string
    unit :string
    data : {value:number,name:Date}[] = []
    
    constructor(property_name:string,dimension:string,unit:string,data: {value:number,name:Date}[]){
        this.property_name = property_name
        this.dimension=dimension
        this.unit=unit
        this.data = data
    }
    
    }
