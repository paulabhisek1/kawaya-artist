import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

	subscriptions: Subscription[] = [];
	songsList             = [];
	songDataList          = [];
	isLoading: boolean 	  = false;
	currentPage:any 	  = 1;
	searchText:any  	  = "";
  	imgURL: string  	  = environment.imageURL;
  	songURL: string  	  = environment.imageURL;
  	totalSongs: number = 0;

	constructor(private _formBuilder: FormBuilder,
    	private commonService: CommonService,
    	private helperService: HelperService,
    	private router: Router) 
	{ }

	ngOnInit(): void {
		this.fetchSongList(); // Fetch Album
	}


	// Start Search
	startSearch() {
		if((this.searchText && this.searchText.length >= 3) || (this.searchText === '')) {
			this.currentPage = 1;
            this.songDataList = [];
			this.fetchSongList();
		}
	}

	// Clear Search
	clearSearch() {
	 if(this.searchText) {
			this.searchText = '';
			this.currentPage = 1;
      		this.songDataList = [];
			this.fetchSongList();
		}
	}


	// Fetch Countries
  fetchSongList() {
    this.isLoading = true;

    this.subscriptions.push(
      this.commonService.getAPICall({
        url :'song-list',
        data: {page: this.currentPage, search: this.searchText}
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {

          	for(let item of result.data.songsList) {
	            item.imgURL  = this.imgURL + item.cover_picture;
	            item.songURL = this.songURL + item.file_name;
	            this.songDataList.push(item);
          	}

          	this.totalSongs = result.data.totalCount;
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

    if (this.totalSongs > this.songDataList.length) {
      this.currentPage++;
      this.fetchSongList()
    }
  }

  navigateToDetails(songID) {
    this.router.navigate(['song/details/'+btoa(songID)])
  }

  navigateToEdit(songID) {
    this.router.navigate(['song/edit/'+btoa(songID)])
  }

}
