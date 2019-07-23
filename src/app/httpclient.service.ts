import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import { catchError, map } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin': '*'})
};

const base = ''
//const base = 'http://localhost:8080/designer/'

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {

    constructor(private http: HttpClient) { }

    /**
   * Function to handle error when the server return an error
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
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
    return this.http.get(base+url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
}

  /**
   * Function to post data
   *
   * @param url
   */
  public post(url: string,body:{}): Observable<any> {

    // Call the http POST
    return this.http.post(base+url,body,httpOptions).pipe(
      map(this.extractData),
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
    return this.http.delete(base+url,httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
}


    


}