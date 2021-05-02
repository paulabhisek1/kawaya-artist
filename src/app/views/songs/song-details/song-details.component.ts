import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html',
  styleUrls: ['./song-details.component.scss']
})
export class SongDetailsComponent implements OnInit {

	songDetails:any   = [];
	imgURL:string     = environment.imageURL;
	songURL:string    = environment.songURL;
	isLoading:boolean = false;
	subscriptions: Subscription[] = [];
  	songID: any;

	constructor(
		private _formBuilder: FormBuilder,
    	private commonService: CommonService,
    	private activatedRoute: ActivatedRoute,
    	private helperService: HelperService,
    	private router: Router
    ) {
		this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
	      this.songID = atob(params['id']);
	    }));
    }

	ngOnInit(): void {
		this.getSongDetails();
	}


	// Fetch Countries
	getSongDetails() {
	    this.isLoading = true;

	    this.subscriptions.push(
	      this.commonService.getAPICall({
	        url :'song-details/'+this.songID,
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          this.songDetails = result.data;
	          if (this.songDetails.cover_picture) {
	          	this.imgURL = this.imgURL + this.songDetails.cover_picture;
	          }else{
	          	this.imgURL = "";
	          }

	          if (this.songDetails.file_name) {
	          	this.songURL  = this.songURL  + this.songDetails.file_name;
	          }else{
	          	this.songURL  = "";
	          }

	          this.songDetails.song_url = environment.songURL + this.songDetails.file_name;

	          
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
