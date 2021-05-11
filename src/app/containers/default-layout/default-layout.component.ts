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

  constructor(
    private router: Router,
    private commonService: CommonService,
    private helperService: HelperService
  ) {

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

    if(localStorage.getItem('active_status')) {
      this.fetchArtistDetails();
    }
  }

  ngOnInit(){
    
  }

  // Fetch Artist Details
  fetchArtistDetails() {
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'artist-details'
      }).subscribe((result)=>{
        if(result.status == 200) {
          localStorage.setItem('active_status', result.data.artist_details.is_active);
          this.is_active = result.data.artist_details.is_active;

          this.navItems.forEach((item, index) => {
            if(this.is_active == 1) {
              if(item.attributes) item.attributes.disabled = false;
            }
            else{
              if(item.attributes) item.attributes.disabled = true;
            }
          })
        }
      },(err)=>{
        this.helperService.showError(err.error.msg)
      })
    )
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
