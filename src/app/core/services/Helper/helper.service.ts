import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private toasterService: ToastrService,
    private router: Router
  ) { }

  /**
   * Shows success
   * @param msg 
   */
  showSuccess(msg) {
    this.toasterService.success(msg, '', {
      timeOut: 3500,
      positionClass: 'toast-bottom-right'
    });
  }
/**
   * Shows error
   * @param msg 
   */
  showError(msg) {
    this.toasterService.error(msg, '', {
      timeOut: 3500,
      positionClass: 'toast-bottom-right'
    });
  }

  /**
   * Handles error
   * @template T 
   * @param [operation] 
   * @param [result] 
   * @returns  
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(
        `Api status code: ${error.status}`,
        `Api status message : ${error.message}`
      );
      
      if(error.status == 401) {
        localStorage.clear();
        // this.showError('Your session has expired. please login again');
        this.router.navigate(['/login']);
      }
      else{
        let errorMessage = '';
        //  || (error.error && error.error.errors)
        if(error.status == 422){
          for (var key in error.error.errors) {
            if (error.error.errors.hasOwnProperty(key)) {
                for (var j = 0; j < error.error.errors[key].length; j++) {
                  errorMessage += error.error.errors[key][j];
                }
            }
          }
        }
        else{
          errorMessage = error.error.message;
        }
        
        error.error.message = errorMessage;
        return throwError(error);
      }
    };
  }
}
