import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { noSpace } from '../../../shared/custom-validators/nospacesvalidator';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.scss']
})
export class AlbumEditComponent implements OnInit {

	editForm: FormGroup;
	formSubmitted: boolean = false;
	subscriptions: Subscription[] = [];
	isLoading: boolean = false;
	albumImage: any = 'assets/images/no_image.png';
	albumImageObj:any;
	albumID: any;
 	imgURL:string     = environment.imageURL;
 	albumDetails:any  = [];
 	imageStatus:number = 0;

	constructor(private _formBuilder: FormBuilder,
		private commonService: CommonService,
		private helperService: HelperService,
		private activatedRoute: ActivatedRoute,
		private router: Router) 
	{
		this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
	      this.albumID = atob(params['id']);
	    }));
	}

	ngOnInit(): void {
		this.getAlbumDetails();
		this.createEditForm();
	}


	// Create Form
  	createEditForm() {
	    this.editForm = this._formBuilder.group({
	      name: ['', [Validators.required, noSpace]],
	      file: ['']
	    })
	}


	// Upload Govt ID Front Page
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
	      	this.imageStatus = 0;
	      	this.albumImage = event.target.result;
	      	this.albumImageObj = mainFile;
	      };
	    }
  	}


	// Get Form Control
	get f() {
		return this.editForm.controls;
	}

	// Fetch Countries
	getAlbumDetails() {
	    this.isLoading = true;

	    this.subscriptions.push(
	      this.commonService.getAPICall({
	        url :'album-details/'+this.albumID,
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          this.albumDetails = result.data.albumDetails;
	          if (this.albumDetails.cover_picture) {
	          	this.imgURL = this.imgURL + this.albumDetails.cover_picture;
	          	this.imageStatus = 1;
	          }else{
	          	this.imgURL = this.albumImage;
	          }

	        this.editForm.patchValue({
               name: this.albumDetails.name
            });
	          
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


	submitUpdateAlbum(){
  		
        this.formSubmitted = true;
	    if(this.editForm.invalid) return;

	    let formData: FormData = new FormData();
	    if (this.albumImageObj) {
	    	formData.append('file', this.albumImageObj, this.albumImageObj.name);
	    } 
        
        formData.append('name', this.editForm.get('name').value);

	    this.subscriptions.push(
	      this.commonService.putAPICall({
	        url: 'update-album/'+this.albumID,
	        data: formData
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          this.helperService.showSuccess(result.msg);
	          this.router.navigate(['/album'])
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
