import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../core/services/Common/common.service';
import { HelperService } from '../../core/services/Helper/helper.service';
import { noSpace } from '../../shared/custom-validators/nospacesvalidator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading: boolean = false;
  requestData: any = {};
  otpValue: string = '';
  formSubmitted: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private router: Router
  ) { 
    this.activatedRoute.params.subscribe(parameter => {
      this.otpValue = atob(parameter.hashValue);
    })
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), noSpace]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get f() {
    return this.resetForm.controls;
  }

  submitForm() {
    this.formSubmitted = true;
    if(this.resetForm.invalid) return;

    this.requestData.url = 'reset-password';
    this.requestData.data = {
      password: this.resetForm.get('password').value,
      confirm_password: this.resetForm.get('confirm_password').value,
      otp: this.otpValue
    }

    this.isLoading = true;
    this.commonService.postAPICall(this.requestData).subscribe((result)=>{
      this.isLoading = false;
      if(result.status == 200) {
        this.helperService.showSuccess(result.msg);
        this.router.navigate(['/login']);
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
