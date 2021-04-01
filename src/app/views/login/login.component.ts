import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/Common/common.service';
import { HelperService } from '../../core/services/Helper/helper.service';
import { noSpace } from '../../shared/custom-validators/nospacesvalidator';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent { 
  loginForm:FormGroup;
  formSubmitted: boolean = false;
  requestData: any = {};
  isLoading: boolean = false;

  regForm: FormGroup;
  regFormSubmitted: boolean = false;
  regRequestData: any = {};
  startDate = new Date();

  commonRequestData:any = {};
  countries:any = [];
  shwSignIn: boolean = true;
  shwSignUp: boolean = false;

  hideLogin: boolean = false;
  hideReg: boolean = false;
  hideRegCon: boolean = false;

  maxDate: Date;
  

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private commonService: CommonService,
    private router: Router,
    public afAuth: AngularFireAuth,
  ) {
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.createForm();
    this.createRegForm();
    this.fetchCountries();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, noSpace]],
      password: ['', [Validators.required, noSpace]]
    })
  }

  createRegForm() {
    this.regForm = this.fb.group({
      full_name: ['', [Validators.required, noSpace]],
      email: ['', [Validators.required,Validators.email, noSpace]],
      mobile_no: ['', [Validators.required, Validators.minLength(10), noSpace]],
      password: ['', [Validators.required, Validators.minLength(6), noSpace]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      country_id: ['', [Validators.required]],
      dob: ['', [Validators.required]]
    })
  }

  get f() {
    return this.loginForm.controls;
  }

  get rf() {
    return this.regForm.controls;
  }

  addDateEvent(event) {
    
  }

  submitLoginForm() {
    this.formSubmitted = true;
    if(this.loginForm.invalid) return;

    this.requestData.url = 'login';
    this.requestData.data = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }

    this.isLoading = true;
    this.commonService.postAPICall(this.requestData).subscribe((result)=>{
      this.isLoading = false;
      if(result.status == 200) {
        localStorage.setItem('artist-access-token',result.data.access_token);
        localStorage.setItem('artist-refresh-token',result.data.refresh_token);
        localStorage.setItem('is_active',result.data.is_active);
        this.helperService.showSuccess(result.msg);
        this.router.navigate(['/upload-document']);
      }
      else{
        this.helperService.showError(result.msg);
      }
    },(err)=>{
      this.isLoading = false;
      this.helperService.showError(err.error.msg);
    })

  }

  fetchCountries() {
    this.commonRequestData.url = 'active-countries';

    this.isLoading = true;
    this.commonService.getAPICall(this.commonRequestData).subscribe((result)=>{
      this.isLoading = false;
      if(result.status == 200) {
        this.countries = result.data.countries;
      }
      else{
        this.helperService.showError(result.msg);
      }
    },(err)=>{
      this.isLoading = false;
      this.helperService.showError(err.error.msg);
    })
  }

  submitRegForm() {
    this.regFormSubmitted = true;
    if(this.regForm.invalid) return;

    this.regRequestData.url = 'register';
    this.regRequestData.data = {
      full_name: this.regForm.get('full_name').value,
      email: this.regForm.get('email').value,
      mobile_no: this.regForm.get('mobile_no').value,
      password: this.regForm.get('password').value,
      confirm_password: this.regForm.get('confirm_password').value,
      dob: moment(this.regForm.get('dob').value).format('YYYY-MM-DD'),
      country_id: this.regForm.get('country_id').value
    }

    this.isLoading = true;
    this.commonService.postAPICall(this.regRequestData).subscribe((result)=>{
      this.isLoading = false;
      if(result.status == 200) {
        localStorage.setItem('artist-access-token',result.data.access_token);
        localStorage.setItem('artist-refresh-token',result.data.refresh_token);
        this.helperService.showSuccess(result.msg);
        this.router.navigate(['/upload-document']);
      }
      else{
        this.helperService.showError(result.msg);
      }
    },(err)=>{
      this.isLoading = false;
      this.helperService.showError(err.error.msg);
    })
  }

  // Auth logic to run auth providers
  facebookLogin() {
    this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((socialResp)=>{
      console.log("FACEBOOK RESP : ", socialResp);
    }).catch((err)=>{
      console.log("ERROR : ", err);
      this.helperService.showError('Something Went Wrong!!!');
    })
  }

  // Auth logic to run auth providers
  googleLogin() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((socialResp)=>{
      this.requestData.data = {
        full_name: socialResp.additionalUserInfo.profile['name'],
        email: socialResp.additionalUserInfo.profile['email'],
        password: socialResp.additionalUserInfo.profile['id'],
        profile_image: socialResp.additionalUserInfo.profile['picture'],
        login_type: 'google'
      }
      this.requestData.url = 'social-login';
      this.isLoading = true;
      this.commonService.postAPICall(this.requestData).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {
          localStorage.setItem('artist-access-token',result.data.access_token);
          localStorage.setItem('artist-refresh-token',result.data.refresh_token);
          this.helperService.showSuccess(result.msg);
          this.router.navigate(['/dashboard']);
        }
        else{
          this.helperService.showError(result.msg);
        }
      },(err)=>{
        this.isLoading = false;
        this.helperService.showError(err.error.msg);
      })
    }).catch((err)=>{
      console.log("ERROR : ", err);
      this.helperService.showError('Something Went Wrong!!!');
    })
  }
}
