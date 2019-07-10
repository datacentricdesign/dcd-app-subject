var express = require("express");
var dotenv = require("dotenv");
var findconfig = require("find-config");
var cors = require('cors')
var bodyParser = require('body-parser')
//import * as dcd from 'dcd-sdk-js'
//import {Strategy,ThingService,PersonService} from 'dcd-sdk-js'
var dcd = require('dcd-sdk-js')
// Faster server renders w/ Prod mode (dev mode never needed)
dotenv.config({ path: findconfig('.env') });
// Express server
var app = express();
const token = process.env.TOKEN
const google_maps_key = process.env.MAPS_KEY
var PORT = process.env.PORT || 8080;
const backends = {
    api: process.env.API_URL,
    user:process.env.USER_URL
  };

const baseUrl = process.env.BASE_URL || '';

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Logout
app.delete(baseUrl+"/oauth2/auth/sessions/login", //checkAuthentication,
async (req, res, next) => {
    const subject = req.query.subject
    console.log('/oauth2/auth/sessions/login'+'?subject=' + subject)
    const result = await dcd.PersonService.logout(subject,token)
    //const result = await dcd.PersonService.revokeConsent(subject,token)
    //const result = await dcd.GETRequest('https://dwd.tudelft.nl:443/oauth2/auth/sessions/login/revoke',token)
    console.log(result)
    res.send(result)
});

app.get(baseUrl+'/mapsKey'//,checkAuthentication
,(req, res) => {
  console.log('mapsKey')
  res.send(
    {key:google_maps_key}
    )
  });

app.get(baseUrl+'/api/things', //checkAuthentication,
    async (req, res, next) => {
        console.log('api/things')
        const result = await dcd.ThingService.readAll(token)
        res.send(result)
    });

   app.get(baseUrl+'/api/things/:thingId', //checkAuthentication,
    async (req, res, next) => {
        const thingId = req.params.thingId;
        console.log('api/things/'+thingId)
        const result = await dcd.ThingService.read(thingId,token)
        res.send(result)
    });


app.get(baseUrl+'/api/user', //checkAuthentication,
    async (req, res, next) => {
        console.log('api/user')
        const result = await dcd.PersonService.readUser(token)
        res.send(result)
    });

    app.get(baseUrl+'/api/persons/:userId', //checkAuthentication,
    async (req, res, next) => {
        const userId = req.params.userId;
        console.log('api/user/'+userId)
        const result = await dcd.PersonService.readUserId(userId,token)
        res.send(result)
    });

    app.get(baseUrl+'/api/things/:thingId/properties/:propertyId', //checkAuthentication,
    async (req, res, next) => {
        const thingId = req.params.thingId
        const propertyId = req.params.propertyId
        const from = req.query.from
        const to = req.query.to 
        console.log('api/things/'+thingId+'/properties/'+propertyId+'?from=' + from + '&to=' + to);
        const result = await dcd.ThingService.readProperty(thingId,propertyId,from,to,token)
        res.send(result)
    });

    app.delete(baseUrl+'/api/things/:thingId',//checkAuthentication,
    async (req, res, next) => {
        const thingId = req.params.thingId
        console.log('delete','api/things/'+thingId)
        const result = await dcd.ThingService.deleteThing(thingId,token)
        res.send(result)
        }
      );

    app.delete(baseUrl+'/api/things/:thingId/properties/:propertyId',//checkAuthentication,
    async (req, res, next) => {
        const thingId = req.params.thingId
        const propertyId = req.params.propertyId
        console.log('delete','api/things/'+thingId+'/properties/'+propertyId)
        const result = await dcd.ThingService.deleteProperty(thingId,propertyId,token)
        res.send(result)
        }
      );

    app.post(baseUrl+'/api/things',//checkAuthentication,
      async (req, res, next) => {
          const jwt = req.query.jwt
          const body = req.body
          console.log('post','api/things/'+'?jwt=' + jwt,body)
          const result = await dcd.ThingService.createThing(body,jwt,token)
          res.send(result)
          }
        );

    app.post(baseUrl+'/api/things/:thingId/properties',//checkAuthentication,
        async (req, res, next) => {
            const thingId = req.params.thingId
            const body = req.body
            console.log('post','api/things/'+thingId+'/properties',body)
            const result = await dcd.ThingService.createProperty(thingId,body,token)
            res.send(result)
            }
          );


// Start up the Node server
app.listen(PORT, function () {
    console.log("Node Express server listening on http://localhost:" + PORT);
});
//# sourceMappingURL=server.js.map