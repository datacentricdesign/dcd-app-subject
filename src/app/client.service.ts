import { Injectable } from "@angular/core";
import { Observable, throwError, } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  
} from "@angular/common/http";

import { catchError, map } from "rxjs/operators";
import { ThrowStmt } from '@angular/compiler';

import { Thing } from 'dcd-sdk-js'
import { Property } from 'dcd-sdk-js'

import {Inject, Optional, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";


const httpOptions = {
  headers: new HttpHeaders({ 
   'Content-Type': 'application/json',
   'Access-Control-Allow-Origin': '*',
   'responseType': 'application/json',
   'Access-Control-Allow-Credentials': 'true'
  }),
  //params: new HttpParams().set('test', 'test')
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private token:string;
  private name :string;
  private id : string;
  private email : string;
  private  things : Thing[] = []
  
  /*constructor(private http: HttpClient) { 
    console.log('service create again')
  }*/

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, 
@Optional() @Inject('serverUrl') protected serverUrl: string)
  {
  }

  public setToken(token:string){
    console.log('setToken()')
    this.token = token
  }

  public getToken(){
    console.log('getToken()')
    return this.token
  }

  public setName(name:string){
    console.log('setName()')
    this.name = name
  }

  public getName(){
    console.log('getName()')
    return this.name
  }

  public setId(id:string){
    console.log('setId()')
    this.id = id 
  }

  public getId(){
    console.log('getId()')
    return this.id
  }

  public setEmail(email:string){
    console.log('setEmail()')
    this.email = email
  }

  public getEmail(){
    console.log('getEmail()')
    return this.email
  }

  public setThings(things : Thing[]){
    console.log('setThings()')
    this.things = things
  }

  public getThings(){
    console.log('getThings()')
    return this.things
  }

  /**
   * Function to handle error when the server return an error
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    console.error("An error occurred:", error);
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

  
  public getData(url:string): Observable<any> {
    // Call the http GET
    /*const httpOptionsi = {
      headers: new HttpHeaders({ 
        'accesstoken' : this.token,
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*',
       'responseType': 'application/json',
       'Access-Control-Allow-Credentials': 'true'
      }),
      //params: new HttpParams().set('test', 'test')
    };*/
    return this.http.get(url).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
}

// Call the http post
public postData(url:string,data: {}): Observable<any> {
  const httpOptionsi = {
    headers: new HttpHeaders({ 
      'accesstoken' : this.token,
     'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
     'responseType': 'application/json',
     'Access-Control-Allow-Credentials': 'true'
    }),
    //params: new HttpParams().set('test', 'test')
  };
  return this.http.get(url, httpOptionsi).pipe(
    map(this.extractData),
    catchError(this.handleError)
  );
}


}

