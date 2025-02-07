import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn = false;
  isClient = false;
  isHotel = false;
  constructor(private authSvc: AuthService, private router: Router) {
    this.authSvc.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.checkUserRole();
    });
  }

  checkUserRole(): void {
    const roles = this.authSvc.getRoles();
    this.isClient = roles.includes('ROLE_CLIENT');
    this.isHotel = roles.includes('ROLE_HOTEL');
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }
}
