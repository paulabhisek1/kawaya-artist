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
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.scss']
})


export class AlbumAddComponent implements OnInit {

	addForm: FormGroup;
	formSubmitted: boolean = false;
	subscriptions: Subscription[] = [];
	isLoading: boolean = false;
	albumImage: any = 'assets/images/no_image.png';
	albumImageObj:any;

	constructor(
		private _formBuilder: FormBuilder,
		private commonService: CommonService,
		private helperService: HelperService,
		private router: Router
	) {
		
	}

	ngOnInit(): void {
		this.createAddForm();
	}

	// Create Form
  	createAddForm() {
	    this.addForm = this._formBuilder.group({
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
	      	this.albumImage = event.target.result;
	      	this.albumImageObj = mainFile;
	      };
	    }
  	}

	// Get Form Control
	get f() {
		return this.addForm.controls;
	}


  	submitAlbum(){
  		
        this.formSubmitted = true;
	    if(this.addForm.invalid) return;

	    let formData: FormData = new FormData();
        formData.append('file', this.albumImageObj, this.albumImageObj.name);
        formData.append('name', this.addForm.get('name').value);
	    this.subscriptions.push(
	      this.commonService.postAPICall({
	        url: 'create-album',
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
