import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { noSpace } from '../../../shared/custom-validators/nospacesvalidator';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {
  // FOR DESIGN MAKE `isLinear = false` To Enable All The Steps
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

  govtIDFront: any = 'assets/images/no_image.png';
  govtIDFrontPath: any = '';
  govtIDBack: any = 'assets/images/no_image.png';
  govtIDBackPath: any = '';
  profilePicture: any = 'assets/images/no_image.png';
  profilePicturePath: any = '';

  sampleSong: any = '';
  sampleSongPath: any = '';

  imageURL: string = environment.imageURL;

  albumsList: any = [];
  genreList: any = [];
  progress: number = 0;
  activeStatus:boolean = false;

  // isLoadingImgFront: boolean = true;

  @ViewChild('stepper', { static: false }) stepper: MatHorizontalStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.fetchCountries(); // Fetch Countries

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
      routing_no: ['', [Validators.required, noSpace]],
      branch_address: ['', [Validators.required, noSpace]],
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
      file: [''],
    });

    // Fourth Form Group
    this.fourthFormGroup = this._formBuilder.group({
      sample_song_name: ['', [Validators.required, noSpace]],
      sample_song: [{ value: '', disabled: true }],
      sample_song_file: [''],
      sample_song_type: ['', [Validators.required, noSpace]],
      sample_song_description: ['', [Validators.required, noSpace]],
    });

    this.fetchCommonDetails(); // Fetch Common Details
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
      account_number: this.secondFormGroup.get('account_number').value.toString(),
      routing_no: this.secondFormGroup.get('routing_no').value.toString(),
      branch_address: this.secondFormGroup.get('branch_address').value,
      branch_name: this.secondFormGroup.get('branch_name').value,
      bank_country: this.secondFormGroup.get('bank_country').value,
      bank_state: this.secondFormGroup.get('bank_state').value,
      bank_city: this.secondFormGroup.get('bank_city').value,
      bank_zip: this.secondFormGroup.get('bank_zip').value,
      currency: this.secondFormGroup.get('currency').value,
      swift_code: this.secondFormGroup.get('swift_code').value.toString(),
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

  // Submit Step Three Form
  submitFormThreeStep() {
    if(!this.govtIDFrontPath){
      this.helperService.showError('Please upload front page of your govt identity');
      return;
    }
    
    if(!this.govtIDBackPath){
      this.helperService.showError('Please upload back page of your govt identity');
      return;
    }

    let requestConfig = {
      govt_id_front: this.govtIDFrontPath,
      govt_id_back: this.govtIDBackPath,
    }

    this.isLoading = true;
    this.subscriptions.push(
      this.commonService.postAPICall({
        url: 'artist-details/step-three',
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

  // Submit Step Four Form
  submitFormFourStep() {
    if(!this.sampleSongPath){
      this.helperService.showError('Please upload a sample song');
      return;
    }

    let requestConfig = {
      sample_song_name: this.fourthFormGroup.get('sample_song_name').value,
      sample_song_path: this.sampleSongPath,
      sample_song_type: this.fourthFormGroup.get('sample_song_type').value,
      sample_song_description: this.fourthFormGroup.get('sample_song_description').value,
    }

    this.isLoading = true;
    this.subscriptions.push(
      this.commonService.postAPICall({
        url: 'artist-details/step-four',
        data: requestConfig
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {
          this.helperService.showSuccess(result.msg);
          this.f4.sample_song_file.reset();
          this.progress = 0;
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

          if (result.data.artist_details.is_active==3 || result.data.artist_details.is_active==1) {
            this.activeStatus  = true;
          }else{
            this.activeStatus  = false;
          }

          localStorage.setItem('active_status', result.data.artist_details.is_active);
          if (result.data.artist_details.is_active=='3') {
            localStorage.setItem('text_status', "Admin need to be approve your request.");
          }

          if (result.data.artist_details.is_active=='2') {
            localStorage.setItem('text_status', "Admin declined your request.");
          }

          if (result.data.artist_details.is_active=='1') {
            localStorage.setItem('text_status', "");
          }



          console.log(this.activeStatus);
          
          this.profilePicture = this.imageURL + this.artistDetails.profile_image;
          this.profilePicturePath = this.artistDetails.profile_image;
          if(result.data.artist_details.artist_account_details) {
            this.artistAccountDetails = result.data.artist_details.artist_account_details;

            if(this.artistAccountDetails.govt_id_front) {
              this.govtIDFront = this.imageURL + this.artistAccountDetails.govt_id_front;
              this.govtIDFrontPath = this.artistAccountDetails.govt_id_front;
            }

            if(this.artistAccountDetails.govt_id_back) {
              this.govtIDBack = this.imageURL + this.artistAccountDetails.govt_id_back;
              this.govtIDBackPath = this.artistAccountDetails.govt_id_back;
            }

            if(this.artistAccountDetails.sample_song_path) {
              this.sampleSongPath = this.artistAccountDetails.sample_song_path;
            }

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
              routing_no: this.artistAccountDetails.routing_no ? this.artistAccountDetails.routing_no : '',
              branch_address: this.artistAccountDetails.branch_address ? this.artistAccountDetails.branch_address : '',
              branch_name: this.artistAccountDetails.branch_name ? this.artistAccountDetails.branch_name : '',
              bank_country: result.data.artist_details.country_id ? result.data.artist_details.country_id : '',
              bank_state: this.artistAccountDetails.zip ? this.artistAccountDetails.bank_state : '',
              bank_city: this.artistAccountDetails.bank_city ? this.artistAccountDetails.bank_city : '',
              bank_zip: this.artistAccountDetails.bank_zip ? this.artistAccountDetails.bank_zip : '',
              currency: this.artistAccountDetails.currency ? this.artistAccountDetails.currency : '',
              swift_code: this.artistAccountDetails.swift_code ? this.artistAccountDetails.swift_code : '',
            })

            this.f2.bank_country.disable();

            // Fourth Step Patch Value
            this.fourthFormGroup.patchValue({
              sample_song_name: this.artistAccountDetails.sample_song_name ? this.artistAccountDetails.sample_song_name : '',
              sample_song_type: this.artistAccountDetails.sample_song_type ? this.artistAccountDetails.sample_song_type : '',
              sample_song_description: this.artistAccountDetails.sample_song_description ? this.artistAccountDetails.sample_song_description : '',
              sample_song_album: this.artistAccountDetails.sample_song_album ? this.artistAccountDetails.sample_song_album : '',
              sample_song: this.artistAccountDetails.sample_song_name ? this.artistAccountDetails.sample_song_name : ''
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

  // Upload Govt ID Front Page
  govtIDFrontUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const mainFile: File = event.target.files[0];
      if (event.target.files[0].type.split('/')[1] != 'png' && event.target.files[0].type.split('/')[1] != 'jpg' && event.target.files[0].type.split('/')[1] != 'jpeg') {
        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
        return;
      }

      // if (event.target.files[0].size > 2097152) {
      //   this.helperService.showError('Image size cannot be greater than 2MB!');
      //   return;
      // }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (event) => { // called once readAsDataURL is completed
        // this.updateProfileRequestData.data.image = mainFile;
        let formData: FormData = new FormData();

        this.isLoading = true
        formData.append('file', mainFile, mainFile.name);
        this.subscriptions.push(
          this.commonService.postAPICall({
            url: 'artist-details/upload-govt-id-front',
            data: formData
          }).subscribe((result)=>{
            this.isLoading = false;
            if(result.status == 200) {
              // this.helperService.showSuccess(result.msg);
              this.govtIDFront = event.target.result;
              this.govtIDFrontPath = result.data.filePath;
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

  // Upload Govt ID Back Page
  govtIDBackUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const mainFile: File = event.target.files[0];
      if (event.target.files[0].type.split('/')[1] != 'png' && event.target.files[0].type.split('/')[1] != 'jpg' && event.target.files[0].type.split('/')[1] != 'jpeg') {
        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
        return;
      }

      // if (event.target.files[0].size > 2097152) {
      //   this.helperService.showError('Image size cannot be greater than 2MB!');
      //   return;
      // }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (event) => { // called once readAsDataURL is completed
        // this.updateProfileRequestData.data.image = mainFile;
        let formData: FormData = new FormData();

        this.isLoading = true
        formData.append('file', mainFile, mainFile.name);
        this.subscriptions.push(
          this.commonService.postAPICall({
            url: 'artist-details/upload-govt-id-back',
            data: formData
          }).subscribe((result)=>{
            this.isLoading = false;
            if(result.status == 200) {
              // this.helperService.showSuccess(result.msg);
              this.govtIDBack = event.target.result;
              this.govtIDBackPath = result.data.filePath;
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
  
  // Upload Profile Picture
  profilePictureUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const mainFile: File = event.target.files[0];
      if (event.target.files[0].type.split('/')[1] != 'png' && event.target.files[0].type.split('/')[1] != 'jpg' && event.target.files[0].type.split('/')[1] != 'jpeg') {
        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
        return;
      }

      // if (event.target.files[0].size > 2097152) {
      //   this.helperService.showError('Image size cannot be greater than 2MB!');
      //   return;
      // }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (event) => { // called once readAsDataURL is completed
        // this.updateProfileRequestData.data.image = mainFile;
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
              this.profilePicture = event.target.result;
              this.profilePicturePath = result.data.filePath;
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

  // Upload Sample Song
  sampleSongUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const mainFile: File = event.target.files[0];
      if (event.target.files[0].type.split('/')[1] != 'mp3' && event.target.files[0].type.split('/')[1] != 'mpeg') {
        this.f4.sample_song_file.reset();
        this.helperService.showError('Only mp3 files are allowed');
        return;
      }

      // if (event.target.files[0].size > 2097152) {
      //   this.helperService.showError('Image size cannot be greater than 2MB!');
      //   return;
      // }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        let formData: FormData = new FormData();

        formData.append('file', mainFile, mainFile.name);
        this.subscriptions.push(
          this.commonService.postUploadAPICall({
            url: 'artist-details/upload-sample-song',
            data: formData
          }).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              let result = event.body;
              if(result.status == 200) {
                this.sampleSong = mainFile.name;
                this.fourthFormGroup.patchValue({
                  sample_song: this.sampleSong
                })
                this.sampleSongPath = result.data.filePath;
              }
              else{
                this.helperService.showError(result.msg);
              }
            }
          },(err)=>{
            this.helperService.showError(err.error.msg);
          })
        )
      };
    }
  }

  // Get First Form Control
  get f1() {
    return this.firstFormGroup.controls;
  }

  // Get Second Form Control
  get f2() {
    return this.secondFormGroup.controls;
  }

  // Get Fourth Form Control
  get f4() {
    return this.fourthFormGroup.controls;
  }

  fetchCommonDetails() {
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'common-details'
      }).subscribe((result)=>{
        if(result.status == 200) {
          this.genreList = result.data.genres;
          this.albumsList = result.data.albums;
        }
      },(err)=>{
        this.helperService.showError(err.error.msg);
      })
    )
  }

  updateColor(progress) {
    if (progress<21){
       return 'primary';
    } else if (progress>80){
       return 'accent';
    } else {
      return 'warn';
    }
  }

  ngOnDestroy() {
    for(let sub of this.subscriptions) {
      if(sub) {
        sub.unsubscribe();
      }
    }
  }

  nextStep(){
    this.stepper.next();
  }

}
