import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems  = navItems;
  public is_active:any = localStorage.getItem('active_status');

  constructor(
    private router: Router
  ) {
    //console.log(navItems)
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
