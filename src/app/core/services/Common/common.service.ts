import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from '../Helper/helper.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiURL: string = environment.apiURL;

  constructor(
    private http: HttpClient,
    private helperService: HelperService
  ) { }

  postAPICall(requestData: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (requestData.contentType) {
      headers = headers.append('Accept', requestData.contentType);
    } else {
      headers = headers.append('Accept', 'application/json');
    }

    return this.http.post<any>(this.apiURL + requestData.url, requestData.data, { headers })
      .pipe(
        catchError(this.helperService.handleError('error ', []))
    );
  }
}
