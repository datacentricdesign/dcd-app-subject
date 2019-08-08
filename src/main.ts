import 'hammerjs';
import 'hammerjs'
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
});

import { defineCustomElements as defineCustomElementsGoogleMaps } from 'web-google-maps/dist/loader'; //Map

defineCustomElementsGoogleMaps(window); //Map
