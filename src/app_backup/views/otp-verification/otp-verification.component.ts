import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../core/services/Common/common.service';
import { HelperService } from '../../core/services/Helper/helper.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {
  mainEmail: string = '';
  mainOTP: string = '';
  mainOTP1: string = '';
  mainOTP2: string = '';
  mainOTP3: string = '';
  mainOTP4: string = '';
  requestData: any = {};
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private helperService: HelperService,
    private router: Router
  ) { 
    this.activatedRoute.params.subscribe(parameter => {
      this.mainEmail = atob(parameter.hashValue);
    })
  }

  ngOnInit(): void {
  }

  sendAgain() {
    this.requestData.url = '/forgot-password';
    this.requestData.data = {
      email: this.mainEmail
    }

    this.isLoading = true;
    this.commonService.postAPICall(this.requestData).subscribe((result)=>{
      this.isLoading = false;
      if(result.status == 200) {
        this.helperService.showSuccess(result.msg);
      }
      else{
        this.helperService.showError(result.msg);
      }
    },(err)=>{
      this.isLoading = false;
      this.helperService.showError(err.error.msg);
    })
  }

  submitForm() {
    this.mainOTP = '';
    this.mainOTP = this.mainOTP.concat(this.mainOTP1, this.mainOTP2, this.mainOTP3, this.mainOTP4);
    this.requestData.data = {
      otp: this.mainOTP,
      email: this.mainEmail
    }
    this.requestData.url = '/verify-otp';

    this.isLoading = true;
    this.commonService.postAPICall(this.requestData).subscribe((result)=>{
      this.isLoading = false;
      if(result.status == 200) {
        this.helperService.showSuccess(result.msg);
        this.router.navigate(['/reset-password/'+ btoa(this.mainOTP)]);
      }
      else{
        this.helperService.showError(result.msg);
      }
    },(err)=>{
      this.isLoading = false;
      this.helperService.showError(err.error.msg);
    })
  }

}
