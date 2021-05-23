import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { noSpace } from '../../../shared/custom-validators/nospacesvalidator';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  formSubmitted: boolean = false;
  profileForm: FormGroup;

  isLoading: boolean = false;
	profileImage: any = 'assets/images/no_image.png';
	profileImageObj:any;
  profileImagePath: string = '';

  artistDetails: any = {};

  maxDate: Date;

  commonRequestData:any = {};
  countries:any = [];

  imageURL: string = environment.imageURL;

  constructor(
    private _formBuilder: FormBuilder,
    private helperService: HelperService,
    private commonService: CommonService
  ) { 
    this.maxDate = new Date();
  }

  // Create Form
  createForm() {
    this.profileForm = this._formBuilder.group({
      profile_image: [''],
      full_name: ['', [Validators.required, noSpace]],
      email: ['', [Validators.required, noSpace]],
      dob: ['', [Validators.required]],
      mobile_no: ['', [Validators.minLength(10), noSpace]],
      country_id: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.fetchCountries();
    this.createForm();
    this.fetchArtistDetails();
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

  updateProfile() {
    this.formSubmitted = true;
    console.log(this.f);
    if(this.profileForm.invalid) return

    let requestConfig = {
      full_name: this.profileForm.get('full_name').value,
      dob: moment(this.profileForm.get('dob').value).format('YYYY-MM-DD'),
      mobile_no: this.profileForm.get('mobile_no').value,
      country_id: this.profileForm.get('country_id').value,
      profile_image: this.profileImagePath
    }

    this.isLoading = true;
    this.subscriptions.push(
      this.commonService.putAPICallUpdate({
        url: 'update-artist-profile',
        data: requestConfig
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {
          this.fetchArtistDetails();
          this.commonService.setUserProfileUpdate();
          this.helperService.showSuccess(result.msg);
        }
        else {
          this.helperService.showError(result.msg);
        }
      },(err)=>{
        this.isLoading = false;
        this.helperService.showError(err.error.msg)
      })
    )
  }

  coverAlbumUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const mainFile: File = event.target.files[0];
      if (event.target.files[0].type.split('/')[1] != 'png' && event.target.files[0].type.split('/')[1] != 'jpg' && event.target.files[0].type.split('/')[1] != 'jpeg') {
        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
        return;
      }	   
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { 
        this.profileImage = event.target.result;
        this.profileImageObj = mainFile;

        let formData: FormData = new FormData();

        this.isLoading = true
        formData.append('file', mainFile, mainFile.name);
        this.subscriptions.push(
          this.commonService.postAPICall({
            url: 'artist-details/upload-profile-picture',
            data: formData
          }).subscribe((result)=>{
            this.isLoading = false;
            if(result.status == 200) {
              // this.helperService.showSuccess(result.msg);
              this.profileImage = event.target.result;
              this.profileImagePath = result.data.filePath;
            }
            else{
              this.helperService.showError(result.msg);
            }
          },(err)=>{
            this.isLoading = false;
            this.helperService.showError(err.error.msg);
          })
        )
      };
    }
  }

  get f() {
    return this.profileForm.controls;
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
          this.profileImage = this.imageURL + this.artistDetails.profile_image;
          this.profileImagePath = this.artistDetails.profile_image;
          this.profileForm.patchValue({
            // profile_image: this.artistDetails.profile_image,
            full_name: this.artistDetails.full_name,
            email: this.artistDetails.email,
            dob: this.artistDetails.dob,
            mobile_no: this.artistDetails.mobile_no,
            country_id: this.artistDetails.country_id
          })
          this.profileForm.get('email').disable();
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

  ngOnDestroy() {
    for(let sub of this.subscriptions) {
      if(sub) sub.unsubscribe();
    }
  }
}
