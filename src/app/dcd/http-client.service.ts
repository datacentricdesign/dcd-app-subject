import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { catchError, map, mergeMap, retryWhen, delay } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

const httpOptionsCSV = {
  headers: new HttpHeaders({
    Accept: 'text/csv',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private http: HttpClient) {}

  /**
   * Function to handle error when the server return an error
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }

  /**
   * Function to extract the data when the server return some
   *
   * @param res
   */
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  /**
   * Function to GET what you want
   *
   * @param url
   */
  public get(url: string): Observable<any> {
    // Call the http GET
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(this.extractData),
        this.delayedRetry(1000, 3),
        catchError(this.handleError)
      );
  }

  /**
   * Function to GET CSV
   *
   * @param url
   */
  public getCSV(url: string): Observable<any> {
    // Call the http GET
    console.log(httpOptionsCSV);

    return this.http
      .get(url, httpOptionsCSV)
      .pipe(
        map(this.extractData),
        this.delayedRetry(1000, 3),
        catchError(this.handleError)
      );
  }

  /**
   * Function to post data
   *
   * @param url
   */
  public post(url: string, body: {}): Observable<any> {
    // Call the http POST
    return this.http
      .post(url, body, httpOptions)
      .pipe(
        map(this.extractData),
        this.delayedRetry(60000, 0),
        catchError(this.handleError)
      );
  }

  /**
   * Function to put data
   *
   * @param url
   */
  public put(url: string, body: {}): Observable<any> {
    // Call the http POST
    return this.http
      .put(url, body, httpOptions)
      .pipe(
        map(this.extractData),
        this.delayedRetry(1000, 3),
        catchError(this.handleError)
      );
  }

  /**
   * Function to delete
   *
   * @param url
   */
  public delete(url: string): Observable<any> {
    // Call the http DELETE
    return this.http
      .delete(url, httpOptions)
      .pipe(
        map(this.extractData),
        this.delayedRetry(1000, 3),
        catchError(this.handleError)
      );
  }

  private getErrorMessage = (maxRetry: number) =>
    `Tried to load Resource over XHR for ${maxRetry} times without sucess. Giving up.`;

  DEFAULT_MAX_RETRIES = 5;

  private delayedRetry(delayMs: number, maxRetry = this.DEFAULT_MAX_RETRIES) {
    let retries = maxRetry;

    return (src: Observable<any>) =>
      src.pipe(
        retryWhen((errors: Observable<any>) =>
          errors.pipe(
            delay(delayMs),
            mergeMap((error) =>
              retries-- > 0
                ? of(error)
                : throwError(this.getErrorMessage(maxRetry))
            )
          )
        )
      );
  }
}
