import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { noSpace } from '../../../shared/custom-validators/nospacesvalidator';

@Component({
  selector: 'app-podcast-edit',
  templateUrl: './podcast-edit.component.html',
  styleUrls: ['./podcast-edit.component.scss']
})
export class PodcastEditComponent implements OnInit {

  	addForm: FormGroup;
	formSubmitted: boolean = false;
	subscriptions: Subscription[] = [];
	isLoading: boolean = false;

	podcastDetails:any   = [];
	podcastCoverImage: any 		= 'assets/images/no_image.png';
	podcastCoverImageObj:any;
	podcastCoverImagePath: any 	= '';

	podcastFile: any 	  		= 'assets/images/no_image.png';
	podcastFileObj:any;
	podcastFilePath: any 		= '';
	podcastFileLength:any		= 0
	progress: number  = 0;

	podcastCategories = [];
	currentPage:any   = 1;
	searchText:any    = "";
	sortKey:any       = 2;
	sortType:any      = "DESC";
	podcastURL:any    = "";
	podcastId:any;
	imgURL:string     = environment.imageURL;
	imageStatus:number = 0;

	constructor(
		private _formBuilder: FormBuilder,
    	private commonService: CommonService,
    	private activatedRoute: ActivatedRoute,
    	private helperService: HelperService,
    	private router: Router
	) {
		this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
	      this.podcastId = atob(params['id']);
	    }));
	}

	ngOnInit(): void {
		this.getPodcastDetails()
		this.createAddForm();
		this.fetchCommonList();
	}

	// Create Form
  	createAddForm() {
	    this.addForm = this._formBuilder.group({
			name: ['', [Validators.required, noSpace]],
			cover_picture: [''],
			length: ['0'],
			file_name: [''],
			details: ['', [Validators.required, noSpace]],
			is_paid: ['', [Validators.required, noSpace]],
			category_id: ['', [Validators.required, noSpace]],
	    })
	}


	// Get Form Control
	get f() {
		return this.addForm.controls;
	}


	// Fetch Countries
	getPodcastDetails() {
	    this.isLoading = true;

	    this.subscriptions.push(
	      this.commonService.getAPICall({
	        url :'podcast-details/'+this.podcastId,
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
				this.podcastDetails = result.data;
				if (this.podcastDetails.cover_picture) {
					this.imageStatus = 1;
					this.imgURL = this.imgURL + this.podcastDetails.cover_picture;
				}else{
					this.imgURL = "";
				}

				if (this.podcastDetails.file_name) {
					this.podcastURL  = environment.songURL  + this.podcastDetails.file_name;
				}else{
					this.podcastURL  = "";
				}

	          	this.addForm.patchValue({
            	   	name         : this.podcastDetails.name,
            	   	details      : this.podcastDetails.details,
					is_paid      : this.podcastDetails.is_paid,
					category_id  : this.podcastDetails.category_id,
            	});

            	this.podcastCoverImagePath  = this.podcastDetails.cover_picture;
            	this.podcastFilePath 		= this.podcastDetails.file_name;
            	this.podcastFileLength      = this.podcastDetails.length;
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

	// Upload Song Cover Image
  	coverPodcastUpload(event) {
	    if (event.target.files && event.target.files[0]) {
	      const mainFile: File = event.target.files[0];
	      if (event.target.files[0].type.split('/')[1] != 'png' && event.target.files[0].type.split('/')[1] != 'jpg' && event.target.files[0].type.split('/')[1] != 'jpeg') {
	        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
	        return;
	      }	   
	      const reader = new FileReader();
	      reader.readAsDataURL(event.target.files[0]); // read file as data url
	      reader.onload = (event) => { 
	      
	      	this.podcastCoverImageObj = mainFile;

	      	let formData: FormData = new FormData();

	        this.isLoading = true
	        formData.append('file', this.podcastCoverImageObj, this.podcastCoverImageObj.name);
	        this.subscriptions.push(
	          this.commonService.postAPICall({
	            url: 'upload-song-cover-image',
	            data: formData
	          }).subscribe((result)=>{
	            this.isLoading = false;
	            if(result.status == 200) {
	            	this.imageStatus = 0;
	              	this.podcastCoverImage     = event.target.result;
	              	this.podcastCoverImagePath = result.data.filePath;
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


  	// Upload Song File
  	filePodcastUpload(event) {
	    if (event.target.files && event.target.files[0]) {
	    	this.podcastURL    = "";
	      const mainFile: File = event.target.files[0];
	      if (event.target.files[0].type.split('/')[1] != 'mp3' && event.target.files[0].type.split('/')[1] != 'mpeg') {
	        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
	        return;
	      }	   
	      const reader = new FileReader();
	      reader.readAsDataURL(event.target.files[0]); // read file as data url
	      reader.onload = (event) => { 
	      
	      	this.podcastFileObj = mainFile;

	      	let formData: FormData = new FormData();

	        formData.append('file', this.podcastFileObj, this.podcastFileObj.name);
	        this.subscriptions.push(
	          this.commonService.postUploadAPICall({
	            url: 'upload-song',
	            data: formData
	          }).subscribe(event => {
	            if (event.type === HttpEventType.UploadProgress) {
	              this.progress = Math.round(100 * event.loaded / event.total);
	            } else if (event instanceof HttpResponse) {
	              let result = event.body;
	              if(result.status == 200) {
	                this.podcastFilePath 	= result.data.filePath;
	                this.podcastURL      	= environment.songURL + result.data.filePath;
	                this.podcastFileLength  = result.data.fileDuration.toString();
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


  	updateColor(progress) {
	    if (progress<21){
	       return 'primary';
	    } else if (progress>80){
	       return 'accent';
	    } else {
	      return 'warn';
	    }
	}

	// Fetch Genre List
  	fetchCommonList() {
	    let requestConfig = {
	      page: 1,
	      search: '',
	      sortKey: '',
	      sortType: ''
	    }
	    requestConfig = JSON.parse(JSON.stringify(requestConfig));
	    this.isLoading = true;
	    this.subscriptions.push(
	      this.commonService.getAPICall({
	        url: 'common-details',
	        data: requestConfig
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          for(let item of result.data.podcastCategories) {
	            this.podcastCategories.push(item);
	          }
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


	submitUpdatePodcast(){
		this.formSubmitted = true;
		//console.log(this.addForm);
	    if(this.addForm.invalid) return;

		let postData = {
			name : this.addForm.get('name').value,
			cover_picture : this.podcastCoverImagePath,
			length : this.podcastFileLength,
			file_name : this.podcastFilePath,
			details : this.addForm.get('details').value,
			is_paid : this.addForm.get('is_paid').value,
			category_id : this.addForm.get('category_id').value,
		}

	    this.subscriptions.push(
	      this.commonService.putAPICall({
	        url: 'update-podcast/'+this.podcastId,
	        data: postData
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          this.helperService.showSuccess(result.msg);
	          this.router.navigate(['/podcast'])
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

}
