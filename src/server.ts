import 'zone.js/dist/zone-node';
export {AppServerModule} from './app/app.server.module';
import { enableProdMode, ComponentFactoryResolver } from '@angular/core';

// Express Engine
import { renderModuleFactory } from '@angular/platform-server'
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv'
import * as findconfig from 'find-config'
import {createRoutes} from './api'

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

dotenv.config({ path: findconfig('.env') })

// Express server
const app = express();

const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), 'dist');

//Oauth2
const serverUrl = process.env.SERVER_URL;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../server/main');

  //const template = readFileSync(join(__dirname, '..', 'dist', 'browser', 'index.html')).toString();
  const template = readFileSync(join(__dirname, '..','browser','subject', 'index.html')).toString();
  app.engine('html', (_, options, callback) => {
    const opts = {
        document: template,
        url: options['req'].url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP),
            {
              provide: 'serverUrl',
              useValue: serverUrl
            },
            {
              provide: 'token',
              useValue: options['req'].user.accessToken
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

createRoutes(app)


    

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});