import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as findconfig from 'find-config';
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as refresh from 'passport-oauth2-refresh'
import * as passport from 'passport'
import {Strategy,RouterAPI} from '@datacentricdesign/sdk-js'
import * as cors from 'cors'

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const DIST_FOLDER = join(process.cwd(), 'dist');

//Domino for window undefined
const domino = require('domino');
const fs = require('fs');
const template = fs.readFileSync(join(DIST_FOLDER, 'browser','subject','index.html')).toString();
const win = domino.createWindow(template);
global['window'] = win;
global['document'] = win.document;
global['DOMTokenList'] = win.DOMTokenList;
global['Node'] = win.Node;
global['Text'] = win.Text;
global['HTMLElement'] = win.HTMLElement;
global['navigator'] = win.navigator;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser','subject'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

//.env
dotenv.config({ path: findconfig('.env') })

const PORT = process.env.PORT || 8080;

const baseUrl = process.env.BASE_URL || ""

const redirectUrl = process.env.BASE_URL || ""
//const redirectUrl = "/subject"

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

passport.use('refresh', refresh);
    
passport.serializeUser((user, done) => {
      done(null, JSON.stringify(user))
});
    
passport.deserializeUser((user, done) => {
      done(null, JSON.parse(user))
});
    
app.use(cors())
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
  
// These routes use the Universal engine
app.get(baseUrl+'/',checkAuthentication,
  async (req, res, next) => {
      console.log('baseUrl')
      console.log('token',req['user'].accessToken)
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
  {failureRedirect: '/auth', failWithError: true}),
  (req, res) => {
  // After success, redirect to the page we came from originally
  console.log('/auth/callback ' + req['session'].redirectTo);
  res.redirect(req['session'].redirectTo)
  }
);
  
//Recup mapsKey
app.get(baseUrl+'/mapsKey',checkAuthentication
  ,(req, res) => {
    console.log('mapsKey')
    res.send(
      {key:google_maps_key}
      )
});
  
//API
app.use(baseUrl+'/api', checkAuthentication, RouterAPI);

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}${baseUrl}`);
});
