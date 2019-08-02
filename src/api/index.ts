import { NgSetupOptions, ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as refresh from 'passport-oauth2-refresh'
import * as passport from 'passport'
import {Strategy,ThingService,PersonService,PropertyService} from '@datacentricdesign/sdk-js'
import * as dotenv from 'dotenv'
import * as findconfig from 'find-config'
import * as cors from 'cors'

// Function that create the route of the api

export function createRoutes(app,baseUrl,redirectUrl){
  dotenv.config({ path: findconfig('.env') })

  //GoogleMaps key :
  const google_maps_key = process.env.MAPS_KEY

  //Oauth2
  const serverUrl = process.env.SERVER_URL;
  
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
    
    app.use(cors())
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
          res.redirect(redirectUrl+'/auth');
            return
        }
        next()
      };
  
    // All regular routes use the Universal engine
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
  
  app.get(redirectUrl+'/auth', passport.authenticate('oauth2'));
  
  
  app.get(redirectUrl+'/auth/callback',
  
  passport.authenticate('oauth2',
  {failureRedirect: '/auth'}),
  (req, res) => {
  // After success, redirect to the page we came from originally
  console.log('/auth/callback ' + req['session'].redirectTo);
  res.redirect(req['session'].redirectTo)
  }
  );
  
  //Logout
  app.delete(baseUrl+"/oauth2/auth/sessions/login", checkAuthentication,
   async (req, res, next) => {
    const subject = req.query.subject
    console.log('/oauth2/auth/sessions/login'+'?subject=' + subject)
    const result = await PersonService.logout(subject,req['user'].accessToken)
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
          const result = await ThingService.list(req['user'].accessToken)
          res.send(result)
      });
  
     app.get(baseUrl+'/api/things/:thingId', checkAuthentication,
       async (req, res, next) => {
          const thingId = req.params.thingId;
          console.log('api/things/'+thingId)
          const result = await ThingService.read(thingId,req['user'].accessToken)
          res.send(result)
      });
  
  
      app.get(baseUrl+'/api/user', checkAuthentication,
       async (req, res, next) => {
          console.log('api/user')
          const result = await PersonService.readUser(req['user'].accessToken)
          res.send(result)
      });
  
      app.get(baseUrl+'/api/persons/:userId', checkAuthentication,
       async (req, res, next) => {
          const userId = req.params.userId;
          console.log('api/user/'+userId)
          const result = await PersonService.readUserId(userId,req['user'].accessToken)
          res.send(result)
      });
  
      app.get(baseUrl+'/api/things/:thingId/properties/:propertyId', checkAuthentication,
       async (req, res, next) => {
        const thingId = req.params.thingId
        const propertyId = req.params.propertyId
        const from = req.query.from
        const to = req.query.to 
        console.log('api/things/'+thingId+'/properties/'+propertyId+'?from=' + from + '&to=' + to);
        const result = await PropertyService.read(thingId,propertyId,from,to,req['user'].accessToken)
        res.send(result)
      });
  
      app.delete(baseUrl+'/api/things/:thingId',checkAuthentication,
       async (req, res, next) => {
          const thingId = req.params.thingId
          console.log('delete','api/things/'+thingId)
          const result = await ThingService.delete(thingId,req['user'].accessToken)
          res.send(result)
          }
        );
  
      app.delete(baseUrl+'/api/things/:thingId/properties/:propertyId',checkAuthentication,
       async (req, res, next) => {
          const thingId = req.params.thingId
          const propertyId = req.params.propertyId
          console.log('delete','api/things/'+thingId+'/properties/'+propertyId)
          const result = await PropertyService.delete(thingId,propertyId,req['user'].accessToken)
          res.send(result)
          }
        );
  
      app.post(baseUrl+'/api/things',checkAuthentication,
        async (req, res, next) => {
            const jwt = req.query.jwt
            const body = req.body
            console.log('post','api/things/'+'?jwt=' + jwt,body)
            const result = await ThingService.create(body,jwt,req['user'].accessToken)
            res.send(result)
            }
          );
  
        app.post(baseUrl+'/api/things/:thingId/properties',checkAuthentication,
          async (req, res, next) => {
              const thingId = req.params.thingId
              const body = req.body
              console.log('post','api/things/'+thingId+'/properties',body)
              const result = await PropertyService.create(thingId,body,req['user'].accessToken)
              res.send(result)
              }
            );
  
    return app;
}

// These function are for the server develloppement HMR

export interface ServerAPIOptions {
  distPath: string;
  ngSetup?: NgSetupOptions;
}

export function createApi(options: ServerAPIOptions) {
  const router = express();

  router.use(createNgRenderMiddleware(options.distPath, options.ngSetup));

  return router;
}

export function createNgRenderMiddleware(distPath: string, ngSetup: NgSetupOptions) {
  const app = express();

  app.set('view engine', 'html');
  app.set('views', distPath);

  // Server static files from distPath
  app.get('*.*', express.static(distPath));

  // Angular Express Engine
  app.engine('html', ngExpressEngine(ngSetup));

  dotenv.config({ path: findconfig('.env') })
  const baseUrl = "" // Because of the HMR 
  const redirectUrl = process.env.BASE_URL

  createRoutes(app,baseUrl,redirectUrl)

  return app;
}


