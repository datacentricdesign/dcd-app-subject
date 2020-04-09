import { Injectable, Inject, Optional } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {
  constructor(
    @Optional() @Inject(REQUEST) protected request: Request,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    let serverReq: HttpRequest<any> = req;
    if (isPlatformServer(this.platformId)) {
      // do server side stuff
      console.log('Universal interceptor server');
    }

    if (isPlatformBrowser(this.platformId)) {
      console.log('Universal interceptor browser');
      // const user: any = localStorage.getItem('user');
      // console.log('user',user)
    }
    if (this.request) {
      let newUrl = `${this.request.protocol}://${this.request.get('host')}`;
      if (!req.url.startsWith('/')) {
        newUrl += '/';
      }
      newUrl += req.url;
      serverReq = req.clone({ url: newUrl });
    }
    // return next.handle(serverReq);
    return next.handle(serverReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      })
    );
  }
}
