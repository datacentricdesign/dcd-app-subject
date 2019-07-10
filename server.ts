import 'zone.js/dist/zone-node';
import { enableProdMode, ComponentFactoryResolver } from '@angular/core';

// Express Engine
import { renderModuleFactory } from '@angular/platform-server'
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as refresh from 'passport-oauth2-refresh'
import * as passport from 'passport'
import {Strategy,ThingService,PersonService} from 'dcd-sdk-js'
import * as dotenv from 'dotenv'
import * as findconfig from 'find-config'



// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

dotenv.config({ path: findconfig('.env') })

// Express server
const app = express();

const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), 'dist');

//Oauth2
const baseUrl = process.env.BASE_URL || '';
const serverUrl = process.env.SERVER_URL;

//GoogleMaps key :
const google_maps_key = process.env.MAPS_KEY

const strategyOptions = {
    authorizationURL: process.env.OAUTH2_AUTH_URL,
    tokenURL: process.env.OAUTH2_TOKEN_URL,
    clientID: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    callbackURL: process.env.OAUTH2_REDIRECT_URL,
    userProfileURL: process.env.OAUTH2_PROFILE,
    state: true,
    scope: ['offline', 'openid', 'profile', 'dcd:things', 'dcd:persons']
  };

  passport.use('oauth2', new Strategy(strategyOptions,
    (accessToken, refreshToken, profile, cb) => cb(null, {accessToken, profile})
  ));
  /*passport.use('oauth2', new PassportStrategy(strategyOptions,
    (accessToken, refreshToken, profile, cb) => cb(null, {accessToken, profile})
  ));*/
  passport.use('refresh', refresh);
  
  passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user))
  });
  
  passport.deserializeUser((user, done) => {
    done(null, JSON.parse(user))
  });
  
  // view engine setup
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  
  // These are middlewares required by passport js
  app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  
  // This is a middleware that checks if the user is authenticated. It also remembers the URL so it can be used to
  // redirect to it after the user authenticated.
  const checkAuthentication = (req, res, next) => {
      // The `isAuthenticated` is available because of Passport.js
      if (!req.isAuthenticated()) {
          req.session.redirectTo = req.url;
        res.redirect(baseUrl+'/auth');
          return
      }
      next()
    };

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

  //const template = readFileSync(join(__dirname, '..', 'dist', 'browser', 'index.html')).toString();
  const template = readFileSync(join(__dirname, '..', 'dist', 'browser','subject', 'index.html')).toString();
  app.engine('html', (_, options, callback) => {
    const opts = {
        document: template,
        url: options.req.url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP),
            {
              provide: 'serverUrl',
              useValue: serverUrl
            },
            {
              provide: 'token',
              useValue: options.req.user.accessToken
            },
        ]
    };
    renderModuleFactory(AppServerModuleNgFactory, opts)
        .then(html => callback(null, html));
});

app.set('view engine', 'html');
//app.set('views', join(DIST_FOLDER, 'browser'));
app.set('views', join(DIST_FOLDER, 'browser','subject'));


// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// These routes use the Universal engine

app.get(baseUrl+'/',checkAuthentication,
async (req, res, next) => {
  //console.log(req)
    console.log('baseUrl')
    res.render('index', { req });
});
// page because the redirection of '/*' crash beacuase there are many other redirection  
app.get(baseUrl+'/page/*',checkAuthentication,
async (req, res, next) => {
    console.log('page')
    res.render('index', { req });
});

app.get(baseUrl+'/auth', passport.authenticate('oauth2'));

app.get(baseUrl+'/auth/callback',

passport.authenticate('oauth2',
{failureRedirect: '/auth'}),
(req, res) => {
// After success, redirect to the page we came from originally
console.log('/auth/callback ' + req.session.redirectTo);
res.redirect(req.session.redirectTo)
}
);

//Logout
app.delete(baseUrl+"/oauth2/auth/sessions/login", checkAuthentication,
 async (req, res, next) => {
  const subject = req.query.subject
  console.log('/oauth2/auth/sessions/login'+'?subject=' + subject)
  const result = await PersonService.logout(subject,req.user.accessToken)
  console.log(result)
  res.send(result)
});

//This shows home page TODO
app.get(baseUrl+'/error', (req, res) => {
    res.render('error', {
        baseUrl: serverUrl + baseUrl,
        message: 'Unknown Error',
        error: {status: 0}
    })
});

//Recup data
app.get(baseUrl+'/mapsKey',checkAuthentication
,(req, res) => {
  console.log('mapsKey')
  res.send(
    {key:google_maps_key}
    )
  });

  app.get(baseUrl+'/api/things', checkAuthentication,
    async (req, res, next) => {
        console.log('api/things')
        const result = await ThingService.readAll(req.user.accessToken)
        res.send(result)
    });

   app.get(baseUrl+'/api/things/:thingId', checkAuthentication,
     async (req, res, next) => {
        const thingId = req.params.thingId;
        console.log('api/things/'+thingId)
        const result = await ThingService.read(thingId,req.user.accessToken)
        res.send(result)
    });


    app.get(baseUrl+'/api/user', checkAuthentication,
     async (req, res, next) => {
        console.log('api/user')
        const result = await PersonService.readUser(req.user.accessToken)
        res.send(result)
    });

    app.get(baseUrl+'/api/persons/:userId', checkAuthentication,
     async (req, res, next) => {
        const userId = req.params.userId;
        console.log('api/user/'+userId)
        const result = await PersonService.readUserId(userId,req.user.accessToken)
        res.send(result)
    });

    app.get(baseUrl+'/api/things/:thingId/properties/:propertyId', checkAuthentication,
     async (req, res, next) => {
      const thingId = req.params.thingId
      const propertyId = req.params.propertyId
      const from = req.query.from
      const to = req.query.to 
      console.log('api/things/'+thingId+'/properties/'+propertyId+'?from=' + from + '&to=' + to);
      const result = await ThingService.readProperty(thingId,propertyId,from,to,req.user.accessToken)
      res.send(result)
    });

    app.delete(baseUrl+'/api/things/:thingId',checkAuthentication,
     async (req, res, next) => {
        const thingId = req.params.thingId
        console.log('delete','api/things/'+thingId)
        const result = await ThingService.deleteThing(thingId,req.user.accessToken)
        res.send(result)
        }
      );

    app.delete(baseUrl+'/api/things/:thingId/properties/:propertyId',checkAuthentication,
     async (req, res, next) => {
        const thingId = req.params.thingId
        const propertyId = req.params.propertyId
        console.log('delete','api/things/'+thingId+'/properties/'+propertyId)
        const result = await ThingService.deleteProperty(thingId,propertyId,req.user.accessToken)
        res.send(result)
        }
      );

    app.post(baseUrl+'/api/things',checkAuthentication,
      async (req, res, next) => {
          const jwt = req.query.jwt
          const body = req.body
          console.log('post','api/things/'+'?jwt=' + jwt,body)
          const result = await ThingService.createThing(body,jwt,req.user.accessToken)
          res.send(result)
          }
        );

      app.post(baseUrl+'/api/things/:thingId/properties',checkAuthentication,
        async (req, res, next) => {
            const thingId = req.params.thingId
            const body = req.body
            console.log('post','api/things/'+thingId+'/properties',body)
            const result = await ThingService.createProperty(thingId,body,req.user.accessToken)
            res.send(result)
            }
          );

    

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});