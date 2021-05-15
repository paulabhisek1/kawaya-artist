import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/services/Common/common.service';
import { HelperService } from '../../../core/services/Helper/helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { noSpace } from '../../../shared/custom-validators/nospacesvalidator';


@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.scss']
})
export class SongEditComponent implements OnInit {


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
	genreList 		  = [];

	songDetails:any   = [];
	imgURL:string     = environment.imageURL;
	songURL:string    = "";
  	songID: any;
  	imageStatus:number = 0;
  	progress: number   = 0;

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
		this.getSongDetails()
		this.createAddForm();
		this.fetchAlbumGenreList();
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
			album_id: ['0'],
			genre_id: ['', [Validators.required, noSpace]],
	    })
	}


	// Get Form Control
	get f() {
		return this.addForm.controls;
	}



	// Fetch Songs
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
					this.imageStatus = 1;
					this.imgURL = this.imgURL + this.songDetails.cover_picture;
				}else{
					this.imgURL = "";
				}

				if (this.songDetails.file_name) {
					this.songURL  = environment.songURL  + this.songDetails.file_name;
				}else{
					this.songURL  = "";
				}

	          	this.addForm.patchValue({
            	   	name      :   this.songDetails.name,
            	   	details   :   this.songDetails.details,
					is_paid   :   this.songDetails.is_paid,
					album_id  :   this.songDetails.album_id,
					genre_id  :   this.songDetails.genre_id,
            	});

            	this.songCoverImagePath = this.songDetails.cover_picture;
            	this.songFilePath 		= this.songDetails.file_name;
            	this.songFileLength     = this.songDetails.length.toString();
	          
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
	            	this.imageStatus = 0;
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
			this.songURL = "";
			const mainFile: File = event.target.files[0];
			if (event.target.files[0].type.split('/')[1] != 'mp3' && event.target.files[0].type.split('/')[1] != 'mpeg') {
				this.helperService.showError('Only MP3/MPEG files allowed');
				return;
			}	   
	      const reader = new FileReader();
	      reader.readAsDataURL(event.target.files[0]); // read file as data url
	      reader.onload = (event) => { 
	      
	      	this.songFileObj = mainFile;

	      	let formData: FormData = new FormData();

	        formData.append('file', this.songFileObj, this.songFileObj.name);
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
	                this.songFilePath 	= result.data.filePath;
	                this.songURL      	= environment.songURL + result.data.filePath;
	                this.songFileLength = result.data.fileDuration.toString();
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
  	fetchAlbumGenreList() {
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
	          for(let item of result.data.genres) {
	            this.genreList.push(item);
	          }

	           for(let item of result.data.albums) {
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


	submitCreateSong(){
		this.formSubmitted = true;
		console.log(this.addForm);
	    if(this.addForm.invalid) return;

		let postData = {
			name : this.addForm.get('name').value,
			cover_picture : this.songCoverImagePath,
			length : this.songFileLength,
			file_name : this.songFilePath,
			details : this.addForm.get('details').value,
			is_paid : this.addForm.get('is_paid').value,
			album_id : this.addForm.get('album_id').value,
			genre_id : this.addForm.get('genre_id').value
		}

	    this.subscriptions.push(
	      this.commonService.putAPICall({
	        url: 'update-song/'+this.songID,
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
