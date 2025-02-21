import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  loginData = { username: '', password: '' }; // ✅ Dati del form

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login riuscito:', response);
        this.authService.getUserId();

        const roles = this.authService.getRoles(); // ✅ Recupera i ruoli dell'utente
        if (roles.includes('ROLE_HOTEL')) {
          this.router.navigate(['/dashboard']);
        } else if (roles.includes('ROLE_CLIENT')) {
          this.router.navigate(['/dashboard-client']);
        } else {
          console.error('❌ Errore: Nessun ruolo valido trovato.');
        }
      },
      error: (error) => {
        console.error('Errore nel login:', error);
      }
    });
  }
}
