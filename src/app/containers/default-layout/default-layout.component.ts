import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from '../../_nav';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../core/services/Common/common.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../../core/services/Helper/helper.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  subscriptions: Subscription[] = [];
  public sidebarMinimized = false;
  public navItems  = navItems;
  public is_active:any = localStorage.getItem('active_status');
  textStatus:any       = localStorage.getItem('text_status');
  profileImage: string = '';
  imageURL: string = environment.imageURL;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private helperService: HelperService
  ) {

    if(localStorage.getItem('is_active')) {
      this.fetchArtistDetails();
    }
    else {
      this.commonService.getUserStatus().subscribe((result)=>{
        this.is_active = result['is_active'];
  
        this.navItems.forEach((item, index) => {
          if(this.is_active == 1) {
            if(item.attributes) item.attributes.disabled = false;
          }
          else{
            if(item.attributes) item.attributes.disabled = true;
          }
        })
      })
    }

    if(localStorage.getItem('artist-access-token')) {
      this.subscriptions.push(
        this.commonService.getUserProfileUpdate().subscribe((result)=>{
          this.fetchArtistDetails();
        })
      )
    }
  }

  ngOnInit(){
    this.fetchArtistDetails();
  }

  // Fetch Artist Details
  fetchArtistDetails() {
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'artist-details'
      }).subscribe((result)=>{
        if(result.status == 200) {
          localStorage.setItem('is_active', result.data.artist_details.is_active);
          this.profileImage = this.imageURL + result.data.artist_details.profile_image;
          this.is_active = result.data.artist_details.is_active;
          this.navItems.forEach((item, index) => {
            if(this.is_active == 1) {
              if(item.attributes) item.attributes.disabled = false;
            }
            else{
              if(item.attributes) item.attributes.disabled = true;
            }
          })

          this.navItems = JSON.parse(JSON.stringify(this.navItems));
        }
      },(err)=>{
        this.helperService.showError(err.error.msg)
      })
    )
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
