var express = require("express");
var path = require("path");
var dotenv = require("dotenv");
var findconfig = require("find-config");
var fetch = require("node-fetch");
var cors = require('cors')
//import * as dcd from 'dcd-sdk-js'
//import {Strategy,ThingService,PersonService} from 'dcd-sdk-js'
var dcd = require('dcd-sdk-js')
// Faster server renders w/ Prod mode (dev mode never needed)
dotenv.config({ path: findconfig('.env') });
// Express server
var app = express();
const token = process.env.TOKEN
var PORT = process.env.PORT || 8080;
const backends = {
    api: process.env.API_URL,
    user:process.env.USER_URL
  };

app.use(cors())

app.get('/api/things', //checkAuthentication,
    async (req, res, next) => {
        console.log('api/things')
        const result = await dcd.ThingService.readAll(token)
        res.send(result)
    });

   app.get('/api/things/:thingId', //checkAuthentication,
    async (req, res, next) => {
        const thingId = req.params.thingId;
        console.log('api/things/'+thingId)
        const result = await dcd.ThingService.read(thingId,token)
        res.send(result)
    });


app.get('/api/user', //checkAuthentication,
    async (req, res, next) => {
        console.log('api/user')
        const result = await dcd.PersonService.readUser(token)
        res.send(result)
    });

    app.get('/api/persons/:userId', //checkAuthentication,
    async (req, res, next) => {
        const userId = req.params.userId;
        console.log('api/user/'+userId)
        const result = await dcd.PersonService.readUserId(userId,token)
        res.send(result)
    });

    app.get('/api/things/:thingId/properties/:propertyId', //checkAuthentication,
    async (req, res, next) => {
        const thingId = req.params.thingId
        const propertyId = req.params.propertyId
        const from = req.query.from
        const to = req.query.to 
        console.log('api/things/'+thingId+'/properties/'+propertyId+'?from=' + from + '&to=' + to);
        const result = await dcd.ThingService.readProperty(thingId,propertyId,from,to,token)
        res.send(result)
    });

    app.delete('/things/:thingId',//checkAuthentication,
    async (req, res, next) => {
        console.log('delete')
        //TODO
        }
      );


// Start up the Node server
app.listen(PORT, function () {
    console.log("Node Express server listening on http://localhost:" + PORT);
});
//# sourceMappingURL=server.js.map