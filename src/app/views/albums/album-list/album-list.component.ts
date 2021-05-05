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
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})



export class AlbumListComponent implements OnInit {

	subscriptions: Subscription[] = [];
	albumsList          = [];
	albumDataList       = [];
	isLoading: boolean 	= false;
	currentPage:any 	  = 1;
	searchText:any  	  = "";
	sortKey:any     	  = 2;
	sortType:any    	  = "DESC";
  imgURL: string  	  = environment.imageURL;
  totalAlbums: number = 0;
  searchStatus:number = 0;

	constructor(
		  private _formBuilder: FormBuilder,
    	private commonService: CommonService,
    	private helperService: HelperService,
    	private router: Router
    ){



    }

	ngOnInit(): void {
		this.fetchAlbumList(); // Fetch Album
	}


	// Start Search
	startSearch() {
		if((this.searchText && this.searchText.length >= 3) || (this.searchText === '')) {
			this.currentPage   = 1;
      this.albumDataList = [];
      this.searchStatus  = 1;
			this.fetchAlbumList();
		}
	}

	// Clear Search
	clearSearch() {
	 if(this.searchText) {
			this.searchText = '';
			this.currentPage = 1;
      this.albumDataList = [];
			this.fetchAlbumList();
		}
	}


	// Fetch Countries
  fetchAlbumList() {

    if (this.searchStatus==0) {
      this.isLoading = true;
    }
    

    this.subscriptions.push(
      this.commonService.getAPICall({
        url :'album-list',
        data: {page: this.currentPage, search: this.searchText, sortKey: this.sortKey, sortType: this.sortType}
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {

          if(this.currentPage == 1) {
            this.albumDataList = [];
          }

          for(let item of result.data.albumsList) {
            item.imgURL = this.imgURL + item.cover_picture;
            this.albumDataList.push(item);
          }

          this.totalAlbums = result.data.totalCount;

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

    if (this.totalAlbums > this.albumDataList.length) {
      this.currentPage++;
      this.fetchAlbumList()
    }
  }

  navigateToDetails(artistID) {
    this.router.navigate(['album/details/'+btoa(artistID)])
  }

  navigateToEdit(artistID) {
    this.router.navigate(['album/edit/'+btoa(artistID)])
  }


    // Open Status Change Confirmation
  openDeleteConfirmation(albumId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this album?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteAlbum(albumId)
      } 
    })
  }


  deleteAlbum(albumId){
    this.isLoading = true;

    this.subscriptions.push(
      this.commonService.deleteAPICall({
        url :'album-delete/' + albumId,
      }).subscribe((result)=>{
        this.isLoading = false;
        if(result.status == 200) {
          this.helperService.showSuccess(result.msg);
          this.currentPage = 1;
          this.albumDataList = [];
          this.fetchAlbumList();
            
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
