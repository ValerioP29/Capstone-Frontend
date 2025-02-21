import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

declare var bootstrap: any;  // Importa Bootstrap in modo che Angular possa riconoscere le sue funzionalità JS

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent implements AfterViewInit {
  isLoggedIn = false;
  isClient = false;
  isHotel = false;

  constructor(private authSvc: AuthService, private router: Router) {
    this.authSvc.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.authSvc.roles$.subscribe(roles => {
      this.isClient = roles.includes('ROLE_CLIENT');
      this.isHotel = roles.includes('ROLE_HOTEL');
    });
  }

  ngAfterViewInit() {
    // Inizializza il navbar-toggler di Bootstrap
    const toggleButton = document.querySelector('.navbar-toggler');
    const collapseMenu = document.querySelector('#navbarNav');
    if (toggleButton && collapseMenu) {
      new bootstrap.Collapse(collapseMenu, {
        toggle: false
      });
    }
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
}
