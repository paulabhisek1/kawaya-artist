import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { HelperService } from '../Helper/helper.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiURL: string = environment.apiURL;

  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) { }

  // Post API Call
  postAPICall(requestData: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (requestData.contentType) {
      headers = headers.append('Accept', requestData.contentType);
    } else {
      headers = headers.append('Accept', 'application/json');
    }
    if(localStorage.getItem('artist-access-token')) {
      headers = headers.append('Authorization', `Bearer ${localStorage.getItem('artist-access-token')}`)
    }

    return this.http.post<any>(this.apiURL + requestData.url, requestData.data, { headers })
      .pipe(
        catchError(this.helperService.handleError('error ', []))
    );
  }

  // Post Upload API Call
  postUploadAPICall(requestData: any): Observable<HttpEvent<any>> {
    let headers: HttpHeaders = new HttpHeaders();
    if (requestData.contentType) {
      headers = headers.append('Accept', requestData.contentType);
    } else {
      headers = headers.append('Accept', 'application/json');
    }
    if(localStorage.getItem('artist-access-token')) {
      headers = headers.append('Authorization', `Bearer ${localStorage.getItem('artist-access-token')}`)
    }

    const req = new HttpRequest('POST', `${this.apiURL}${requestData.url}`, requestData.data, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  // Get API Call
  getAPICall(requestData: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (requestData.contentType) {
      headers = headers.append('Accept', requestData.contentType);
    } else {
      headers = headers.append('Accept', 'application/json');
    }
    if(localStorage.getItem('artist-access-token')) {
      headers = headers.append('Authorization', `Bearer ${localStorage.getItem('artist-access-token')}`)
    }
    let params = new HttpParams();
    for (const key in requestData.data) {
      if (requestData.data.hasOwnProperty(key)) {
        params = params.append(key, requestData.data[key]);
      }
    }

    return this.http.get<any>(this.apiURL + requestData.url, { headers, params })
      .pipe(
        catchError(this.helperService.handleError('error ', []))
    );
  }

  // Put API Call
  putAPICall(requestData: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (requestData.contentType) {
      headers = headers.append('Accept', requestData.contentType);
    } else {
      headers = headers.append('Accept', 'application/json');
    }
    if(localStorage.getItem('artist-access-token')) {
      headers = headers.append('Authorization', `Bearer ${localStorage.getItem('artist-access-token')}`)
    }
    let params = new HttpParams();
    for (const key in requestData.data) {
      if (requestData.data.hasOwnProperty(key)) {
        params = params.append(key, requestData.data[key]);
      }
    }
    return this.http.put<any>(this.apiURL + requestData.url, requestData.data, { headers, params })
      .pipe(
        catchError(this.helperService.handleError('error ', []))
    );
  }

  // Delete API Call
  deleteAPICall(requestData: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (requestData.contentType) {
      headers = headers.append('Accept', requestData.contentType);
    } else {
      headers = headers.append('Accept', 'application/json');
    }
    if(localStorage.getItem('artist-access-token')) {
      headers = headers.append('Authorization', `Bearer ${localStorage.getItem('artist-access-token')}`)
    }

    return this.http.delete<any>(this.apiURL + requestData.url, { headers })
      .pipe(
        catchError(this.helperService.handleError('error ', []))
    );
  }
}
