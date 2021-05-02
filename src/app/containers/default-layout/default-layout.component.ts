import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from '../../_nav';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems  = navItems;
  public is_active:any = localStorage.getItem('active_status');
  textStatus:any       = localStorage.getItem('text_status');

  constructor(
    private router: Router,
  ) {
    console.log(this.is_active)
    
  }

  ngOnInit(){
  
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
