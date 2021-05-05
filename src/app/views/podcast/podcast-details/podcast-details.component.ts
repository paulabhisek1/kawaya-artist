import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-podcast-details',
  templateUrl: './podcast-details.component.html',
  styleUrls: ['./podcast-details.component.scss']
})
export class PodcastDetailsComponent implements OnInit {

	podcastDetails:any   = [];
	imgURL:string        = environment.imageURL;
	podcastURL:string    = environment.songURL;
	isLoading:boolean    = false;
	subscriptions: Subscription[] = [];
  	podcastID: any;

	constructor(private _formBuilder: FormBuilder,
    	private commonService: CommonService,
    	private activatedRoute: ActivatedRoute,
    	private helperService: HelperService,
    	private router: Router
    ) {

    	this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
	      this.podcastID = atob(params['id']);
	    }));

    }

	ngOnInit(): void {
		this.getPodcastDetails();
	}

	// Fetch Countries
	getPodcastDetails() {
	    this.isLoading = true;

	    this.subscriptions.push(
	      this.commonService.getAPICall({
	        url :'podcast-details/'+this.podcastID,
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          this.podcastDetails = result.data;
	          if (this.podcastDetails.cover_picture) {
	          	this.imgURL = this.imgURL + this.podcastDetails.cover_picture;
	          }else{
	          	this.imgURL = "";
	          }

	          if (this.podcastDetails.file_name) {
	          	this.podcastURL  = this.podcastURL  + this.podcastDetails.file_name;
	          }else{
	          	this.podcastURL  = "";
	          }

	          this.podcastDetails.podcast_url = environment.songURL + this.podcastDetails.file_name;

	          
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
