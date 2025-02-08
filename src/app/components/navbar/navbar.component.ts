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
    });

    // 🔹 Aspettiamo i ruoli PRIMA di aggiornare la navbar
    this.authSvc.roles$.subscribe(roles => {
      console.log('🔄 Ruoli aggiornati nella navbar:', roles);
      this.isClient = roles.includes('ROLE_CLIENT');
      this.isHotel = roles.includes('ROLE_HOTEL');
    });
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }
}
