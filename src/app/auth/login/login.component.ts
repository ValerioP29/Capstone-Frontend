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
        this.router.navigate(['/dashboard']); // ✅ Reindirizza alla dashboard
      },
      error: (error) => {
        console.error('Errore nel login:', error);
      }
    });
  }
}
