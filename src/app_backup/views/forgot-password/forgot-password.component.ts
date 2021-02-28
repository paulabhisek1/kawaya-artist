import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/Common/common.service';
import { HelperService } from '../../core/services/Helper/helper.service';
import { noSpace } from '../../shared/custom-validators/nospacesvalidator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;
  requestData: any = {};

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.forgotForm = this.fb.group({
      email: ['',[Validators.required, noSpace]]
    })
  }

  get f() {
    return this.forgotForm.controls;
  }

  submitForm() {
    this.formSubmitted = true;
    if(this.forgotForm.invalid) return;

    this.requestData.url = '/forgot-password';
    this.requestData.data = {
      email: this.forgotForm.get('email').value
    }

    this.isLoading = true;
    this.commonService.postAPICall(this.requestData).subscribe((result)=>{
      this.isLoading = false;
      if(result.status == 200) {
        this.helperService.showSuccess(result.msg);
        this.router.navigate(['/otp-verification/'+ btoa(this.forgotForm.get('email').value)]);
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
