import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';
import { map,retry, takeUntil, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

const headers = new HttpHeaders()
            .set('Content-Type','application/json')
            
@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient
    ){ }

    post(url: string, data: any,): Observable<any>{

        return this.http.post(url, data, { headers })
                        .pipe(
                            catchError(this.handleError)
                        )
    }

    get(url: string, params: any = null): Observable<any>{
        var _params = this.serialize(params);
        return this.http.get(url, { params: _params })
                    .pipe(
                        catchError(this.handleError)
                    )
    }

    put(url: string, data: any): Observable<any>{
        return this.http.put(url, data, { headers })
                        .pipe(
                            catchError(this.handleError)
                        )
    }

    delete(url:string, params: any = null): Observable<any>{
        var _params = this.serialize(params);
        return this.http.delete(url, { params: _params })
                    .pipe(
                        catchError(this.handleError)
                    )
    }

    private handleError(error: HttpErrorResponse) {
       
        // if (error.message === "No JWT present or has expired") {
        //     this.global.TokenExpired = 'true';
        //     this.global.logout();
        //     return Observable.empty();
        // }        
        return throwError(error);
    }


    
    serialize(obj: any): any {

        if(obj == null)
            return {};

        let params = new HttpParams();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var element = obj[key];
                params =  params.set(key, element);
            }
        }      
        return params;
    }

}