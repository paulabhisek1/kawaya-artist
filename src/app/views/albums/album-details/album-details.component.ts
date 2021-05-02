import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {

	albumDetails:any  = [];
	imgURL:string     = environment.imageURL;
	isLoading:boolean = false;
	subscriptions: Subscription[] = [];
  	albumID: any;

  	constructor(
  		private _formBuilder: FormBuilder,
    	private commonService: CommonService,
    	private activatedRoute: ActivatedRoute,
    	private helperService: HelperService,
    	private router: Router
  	) { 
  		this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
	      this.albumID = atob(params['id']);
	    }));
  	}

	ngOnInit(): void {
		this.getAlbumDetails();
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
	          }else{
	          	this.imgURL = "";
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

}
