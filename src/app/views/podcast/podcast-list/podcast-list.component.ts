import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit {

	subscriptions: Subscription[] = [];
	podcastList           = [];
	podcastDataList       = [];
	isLoading: boolean 	  = false;
	currentPage:any 	    = 1;
	searchText:any  	    = "";
	imgURL: string  	    = environment.imageURL;
	podcastURL: string  	= environment.songURL;
	totalpodcasts: number = 0;
  	searchStatus:number   = 0;

	constructor(private _formBuilder: FormBuilder,
    	private commonService: CommonService,
    	private helperService: HelperService,
    	private router: Router) 
	{

    }

	ngOnInit(): void {
		this.fetchPodcastList(); // Fetch Songs
	}


	// Start Search
	startSearch() {
		if((this.searchText && this.searchText.length >= 3) || (this.searchText === '')) {
			this.currentPage  = 1;
      		this.podcastList = [];
      		this.searchStatus = 1;
			this.fetchPodcastList();
		}
	}

	// Clear Search
	clearSearch() {
	 	if(this.searchText) {
			this.searchText   = '';
			this.currentPage  = 1;
      		this.podcastList = [];
			this.fetchPodcastList();
		}
	}


	// Fetch Podcast
  	fetchPodcastList() {

	    if (this.searchStatus==0) {
	      this.isLoading = true;
	    }
	    

	    this.subscriptions.push(
	      this.commonService.getAPICall({
	        url :'podcasts-list',
	        data: {page: this.currentPage, search: this.searchText}
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {

	          	if(this.currentPage == 1) {
	            	this.podcastList = [];
	          	}

	        	for(let item of result.data.podcastsList) {
	            	item.imgURL  = this.imgURL + item.cover_picture;
	            	item.podcastURL = this.podcastURL + item.file_name;
	            	this.podcastList.push(item);
	        	}

	        	this.totalpodcasts = result.data.totalCount;

	          	this.searchStatus = 0;
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

	// On Scroll Pagination
	onScroll() {
		if (this.isLoading) {
			return
		}

		if (this.totalpodcasts > this.podcastList.length) {
			this.currentPage++;
			this.fetchPodcastList()
		}
	}

	navigateToDetails(podcastId) {
		this.router.navigate(['podcast/details/'+btoa(podcastId)])
	}

	navigateToEdit(podcastId) {
		this.router.navigate(['podcast/edit/'+btoa(podcastId)])
	}


	// Open Status Change Confirmation
	openDeleteConfirmation(podcastId) {
	    Swal.fire({
	      title: 'Are you sure?',
	      text: 'You want to delete this podcast ?',
	      icon: 'warning',
	      showCancelButton: true,
	      confirmButtonText: 'Yes',
	      cancelButtonText: 'No, keep it'
	    }).then((result) => {
	      if (result.value) {
	        this.deletePodcast(podcastId)
	      } 
	    })
	}


	deletePodcast(podcastId){
	    this.isLoading = true;

	    this.subscriptions.push(
	      this.commonService.deleteAPICall({
	        url :'delete-podcast/' + podcastId,
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          this.helperService.showSuccess(result.msg);
	          this.currentPage = 1;
	          this.podcastList = [];
	          this.fetchPodcastList();
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
