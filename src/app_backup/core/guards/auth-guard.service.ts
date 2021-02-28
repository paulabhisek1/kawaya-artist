import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('artist-access-token')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
      // return true;
    }

  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (!localStorage.getItem('artist-access-token')) {
      return true;
    } else {
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (!localStorage.getItem('artist-access-token')) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
