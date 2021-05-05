import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';;
import { noSpace } from '../../../shared/custom-validators/nospacesvalidator';

@Component({
  selector: 'app-podcast-add',
  templateUrl: './podcast-add.component.html',
  styleUrls: ['./podcast-add.component.scss']
})
export class PodcastAddComponent implements OnInit {

	addForm: FormGroup;
	formSubmitted: boolean = false;
	subscriptions: Subscription[] = [];
	isLoading: boolean = false;


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

	constructor(private _formBuilder: FormBuilder,
		private commonService: CommonService,
		private helperService: HelperService,
		private router: Router) { }

	ngOnInit(): void {
		this.createAddForm();
		this.fetchCommonList();
	}

	// Create Form
  	createAddForm() {
	    this.addForm = this._formBuilder.group({
			name: ['', [Validators.required, noSpace]],
			cover_picture: ['', [Validators.required, noSpace]],
			length: ['0'],
			file_name: ['', [Validators.required, noSpace]],
			details: ['', [Validators.required, noSpace]],
			is_paid: ['', [Validators.required, noSpace]],
			category_id: ['', [Validators.required, noSpace]],
	    })
	}


	// Get Form Control
	get f() {
		return this.addForm.controls;
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


	submitCreatePodcast(){
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
	      this.commonService.postAPICall({
	        url: 'create-podcast',
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
