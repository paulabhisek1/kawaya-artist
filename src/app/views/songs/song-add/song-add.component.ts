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
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.scss']
})
export class SongAddComponent implements OnInit {

	addForm: FormGroup;
	formSubmitted: boolean = false;
	subscriptions: Subscription[] = [];
	isLoading: boolean = false;


	songCoverImage: any = 'assets/images/no_image.png';
	songCoverImageObj:any;
	songCoverImagePath: any = '';

	songFile: any 	  = 'assets/images/no_image.png';
	songFileObj:any;
	songFilePath: any = '';
	songFileLength:any= 0

	albumDataList     = [];
	currentPage:any   = 1;
	searchText:any    = "";
	sortKey:any       = 2;
	sortType:any      = "DESC";


	genreList = [];

	constructor(
		private _formBuilder: FormBuilder,
		private commonService: CommonService,
		private helperService: HelperService,
		private router: Router
	) {  

	}

	ngOnInit(): void {
		this.createAddForm();
		this.fetchAlbumList();
		//this.getGenreList();
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
			album_id: [''],
			genre_id: ['0', [Validators.required, noSpace]],
	    })
	}


	// Get Form Control
	get f() {
		return this.addForm.controls;
	}

	// Upload Song Cover Image
  	coverSongUpload(event) {
	    if (event.target.files && event.target.files[0]) {
	      const mainFile: File = event.target.files[0];
	      if (event.target.files[0].type.split('/')[1] != 'png' && event.target.files[0].type.split('/')[1] != 'jpg' && event.target.files[0].type.split('/')[1] != 'jpeg') {
	        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
	        return;
	      }	   
	      const reader = new FileReader();
	      reader.readAsDataURL(event.target.files[0]); // read file as data url
	      reader.onload = (event) => { 
	      
	      	this.songCoverImageObj = mainFile;

	      	let formData: FormData = new FormData();

	        this.isLoading = true
	        formData.append('file', this.songCoverImageObj, this.songCoverImageObj.name);
	        this.subscriptions.push(
	          this.commonService.postAPICall({
	            url: 'upload-song-cover-image',
	            data: formData
	          }).subscribe((result)=>{
	            this.isLoading = false;
	            if(result.status == 200) {
	              this.songCoverImage     = event.target.result;
	              this.songCoverImagePath = result.data.filePath;
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
  	fileSongUpload(event) {
	    if (event.target.files && event.target.files[0]) {
	      const mainFile: File = event.target.files[0];
	      if (event.target.files[0].type.split('/')[1] != 'mp3' && event.target.files[0].type.split('/')[1] != 'mpeg') {
	        this.helperService.showError('Only JPG/JPEG/PNG files allowed');
	        return;
	      }	   
	      const reader = new FileReader();
	      reader.readAsDataURL(event.target.files[0]); // read file as data url
	      reader.onload = (event) => { 
	      
	      	this.songFileObj = mainFile;

	      	let formData: FormData = new FormData();

	        this.isLoading = true
	        formData.append('file', this.songFileObj, this.songFileObj.name);
	        this.subscriptions.push(
	          this.commonService.postAPICall({
	            url: 'upload-song',
	            data: formData
	          }).subscribe((result)=>{
	            this.isLoading = false;
	            if(result.status == 200) {
	              this.songFile     = event.target.result;
	              this.songFilePath = result.data.filePath;
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


  	// Fetch Countries
  	fetchAlbumList() {
	    this.isLoading = true;

	    this.subscriptions.push(
	      this.commonService.getAPICall({
	        url :'album-list',
	        data: {page: this.currentPage, search: this.searchText, sortKey: this.sortKey, sortType: this.sortType}
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          for(let item of result.data.albumsList) {
	            this.albumDataList.push(item);
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


	// Fetch Genre List
  	getGenreList() {
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
	        url: 'genre-list',
	        data: requestConfig
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          for(let item of result.data.genre_list) {
	            this.genreList.push(item);
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


	submitCreateSong(){
		this.formSubmitted = true;
		console.log(this.addForm);
	    if(this.addForm.invalid) return;

		let postData = {
			name : this.addForm.get('name').value,
			cover_picture : this.songCoverImagePath,
			length : '2.3',
			file_name : this.songFilePath,
			details : this.addForm.get('details').value,
			is_paid : this.addForm.get('is_paid').value,
			album_id : this.addForm.get('album_id').value,
			genre_id : this.addForm.get('genre_id').value
		}

	    this.subscriptions.push(
	      this.commonService.postAPICall({
	        url: 'create-song',
	        data: postData
	      }).subscribe((result)=>{
	        this.isLoading = false;
	        if(result.status == 200) {
	          this.helperService.showSuccess(result.msg);
	          this.router.navigate(['/song'])
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
