import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';

// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

// .env
import * as dotenv from 'dotenv';
import * as findconfig from 'find-config';
import {join} from 'path';
import {DCDApp} from '@datacentricdesign/sdk-js';

dotenv.config({path: findconfig('.env')});

const options = {
    baseUrl: process.env.BASE_URL || '',
    port: process.env.PORT || 8080,
    strategy: {
        authorizationURL: process.env.OAUTH2_AUTH_URL,
        tokenURL: process.env.OAUTH2_TOKEN_URL,
        clientID: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        callbackURL: process.env.OAUTH2_REDIRECT_URL,
        userProfileURL: process.env.OAUTH2_PROFILE,
        state: true,
        scope: ['offline', 'openid', 'profile', 'dcd:things', 'dcd:persons']

    }
};

const dcdApp = new DCDApp(options);

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = new DCDApp();

const DIST_FOLDER = join(process.cwd(), 'dist');

// Domino for window undefined
const domino = require('domino');
const fs = require('fs');
const template = fs.readFileSync(join(DIST_FOLDER, 'browser', 'subject', 'index.html')).toString();
const win = domino.createWindow(template);
global['window'] = win;
global['document'] = win.document;
global['DOMTokenList'] = win.DOMTokenList;
global['Node'] = win.Node;
global['Text'] = win.Text;
global['HTMLElement'] = win.HTMLElement;
global['navigator'] = win.navigator;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser', 'subject'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
    maxAge: '1y'
}));

const google_maps_key = process.env.MAPS_KEY;



const subjectAPI = new SubjectAPI(model, this.baseUrl);
app.use(options.baseUrl, this.subjectAPI.router);

// Start up the Node server
app.listen(options.port, () => {
    console.log(`Node Express server listening on http://localhost:${options.port}${options.baseUrl}`);
});
