import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { noSpace } from '../../../shared/custom-validators/nospacesvalidator';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {
  isLinear = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  artistDetails: any = {};
  artistAccountDetails: any = {};

  subscriptions: Subscription[] = [];
  isLoading: boolean = false;

  selectedStep = 0;
  countries: any = [];

  @ViewChild('stepper', { static: false }) stepper: MatHorizontalStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    // First Form Group
    this.firstFormGroup = this._formBuilder.group({
      street: ['', [Validators.required, noSpace]],
      building_no: ['', [Validators.required, noSpace]],
      city: ['', [Validators.required, noSpace]],
      state: ['', [Validators.required, noSpace]],
      zip: ['', [Validators.required, noSpace]]
    });

    // Second Form Group
    this.secondFormGroup = this._formBuilder.group({
      account_holder_name: ['', [Validators.required, noSpace]],
      account_number: ['', [Validators.required, noSpace]],
      branch_name: ['', [Validators.required, noSpace]],
      bank_country: ['', [Validators.required, noSpace]],
      bank_state: ['', [Validators.required, noSpace]],
      bank_city: ['', [Validators.required, noSpace]],
      bank_zip: ['', [Validators.required, noSpace]],
      currency: ['', [Validators.required, noSpace]],
      swift_code: ['', [Validators.required, noSpace]],
    });

    // Third Form Group
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', [Validators.required, noSpace]],
    });

    // Fourth Form Group
    this.fourthFormGroup = this._formBuilder.group({
      secondCtrl: ['', [Validators.required, noSpace]],
    });

    this.fetchCountries(); // Fetch Countries
    this.fetchArtistDetails(); // Fetch Artist Details
  }

  // Submit Step One Form
  submitFormFirstStep() {
    if(this.firstFormGroup.invalid) return;

    let requestConfig = {
      street: this.firstFormGroup.get('street').value,
      building_no: this.firstFormGroup.get('building_no').value,
      city: this.firstFormGroup.get('city').value,
      state: this.firstFormGroup.get('state').value,
      zip: this.firstFormGroup.get('zip').value,
    }

    this.isLoading = true;
    this.subscriptions.push(
      this.commonService.postAPICall({
        url: 'artist-details/step-one',
        data: requestConfig
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {
          this.helperService.showSuccess(result.msg);
          this.stepper.next();
          this.fetchArtistDetails();
        }
        else{
          this.helperService.showError(result.msg);
        }
      },(err)=>{
        this.isLoading = false;
        this.helperService.showError(err.error.msg);
      })
    )
  }

  // Submit Step Two Form
  submitFormSecondStep() {
    if(this.secondFormGroup.invalid) return;

    let requestConfig = {
      account_holder_name: this.secondFormGroup.get('account_holder_name').value,
      account_number: this.secondFormGroup.get('account_number').value,
      branch_name: this.secondFormGroup.get('branch_name').value,
      bank_country: this.secondFormGroup.get('bank_country').value,
      bank_state: this.secondFormGroup.get('bank_state').value,
      bank_city: this.secondFormGroup.get('bank_city').value,
      bank_zip: this.secondFormGroup.get('bank_zip').value,
      currency: this.secondFormGroup.get('currency').value,
      swift_code: this.secondFormGroup.get('swift_code').value,
    }

    this.isLoading = true;
    this.subscriptions.push(
      this.commonService.postAPICall({
        url: 'artist-details/step-two',
        data: requestConfig
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {
          this.helperService.showSuccess(result.msg);
          this.stepper.next();
          this.fetchArtistDetails();
        }
        else{
          this.helperService.showError(result.msg);
        }
      },(err)=>{
        this.isLoading = false;
        this.helperService.showError(err.error.msg);
      })
    )
  }

  // Fetch Artist Details
  fetchArtistDetails() {
    this.isLoading = true;

    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'artist-details'
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {
          this.artistDetails = result.data.artist_details;
          if(result.data.artist_details.artist_account_details) {
            this.artistAccountDetails = result.data.artist_details.artist_account_details;

            // First Step Patch Value
            this.firstFormGroup.patchValue({
              street: this.artistAccountDetails.street ? this.artistAccountDetails.street : '',
              building_no: this.artistAccountDetails.building_no ? this.artistAccountDetails.building_no : '',
              city: this.artistAccountDetails.city ? this.artistAccountDetails.city : '',
              state: this.artistAccountDetails.state ? this.artistAccountDetails.state : '',
              zip: this.artistAccountDetails.zip ? this.artistAccountDetails.zip : '',
            })

            // Second Step Patch Value
            this.secondFormGroup.patchValue({
              account_holder_name: this.artistAccountDetails.account_holder_name ? this.artistAccountDetails.account_holder_name : '',
              account_number: this.artistAccountDetails.account_number ? this.artistAccountDetails.account_number : '',
              branch_name: this.artistAccountDetails.branch_name ? this.artistAccountDetails.branch_name : '',
              bank_country: this.artistAccountDetails.bank_country ? this.artistAccountDetails.bank_country : '',
              bank_state: this.artistAccountDetails.zip ? this.artistAccountDetails.bank_state : '',
              bank_city: this.artistAccountDetails.bank_city ? this.artistAccountDetails.bank_city : '',
              bank_zip: this.artistAccountDetails.bank_zip ? this.artistAccountDetails.bank_zip : '',
              currency: this.artistAccountDetails.currency ? this.artistAccountDetails.currency : '',
              swift_code: this.artistAccountDetails.swift_code ? this.artistAccountDetails.swift_code : '',
            })
          }
        } 
        else{
          this.artistDetails = {};
          this.helperService.showError(result.msg);
        }
      },(err)=>{
        this.isLoading = false;
        this.artistDetails = {};
        this.helperService.showError(err.error.msg)
      })
    )
  }

  // Fetch Countries
  fetchCountries() {
    this.isLoading = true;

    this.subscriptions.push(
      this.commonService.getAPICall({
        url :'countries'
      }).subscribe((result)=>{
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
    )
  }

  // Get First Form Control
  get f1() {
    return this.firstFormGroup.controls;
  }

  // Get Second Form Control
  get f2() {
    return this.secondFormGroup.controls;
  }

  ngOnDestroy() {
    for(let sub of this.subscriptions) {
      if(sub) {
        sub.unsubscribe();
      }
    }
  }

}
