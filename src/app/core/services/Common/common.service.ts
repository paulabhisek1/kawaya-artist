import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { HelperService } from '../Helper/helper.service';
import { catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiURL: string = environment.apiURL;
  userDetails = new Subject();

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private router: Router
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

  // Put API Call
  putAPICallUpdate(requestData: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (requestData.contentType) {
      headers = headers.append('Accept', requestData.contentType);
    } else {
      headers = headers.append('Accept', 'application/json');
    }
    if(localStorage.getItem('artist-access-token')) {
      headers = headers.append('Authorization', `Bearer ${localStorage.getItem('artist-access-token')}`)
    }

    return this.http.put<any>(this.apiURL + requestData.url, requestData.data, { headers })
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

  setUserStatus(data) {
    this.userDetails.next(data);
  }

  getUserStatus() {
    return this.userDetails.asObservable();
  }

  // Fetch Artist Details
  fetchArtistDetails() {
      this.getAPICall({
        url: 'artist-details'
      }).subscribe((result)=>{
        if(result.status == 200) {
          localStorage.setItem('is_active', result.data.artist_details.is_active);
          if(result.data.artist_details.is_active == 1) {
            return;
          }
          else {
            this.router.navigate(['/upload-document']);
          }
        }
      },(err)=>{
        this.router.navigate(['/upload-document']);
        this.helperService.showError(err.error.msg)
      })
  }

  checkActiveUser() {
    this.fetchArtistDetails();
  }
}
