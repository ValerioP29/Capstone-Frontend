import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {

  registerData = { username: '', email: '', password: '', roles: [ 'ROLE_CLIENT' ] };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.registerData).subscribe({
      next: response => {
        console.log( response.message);
        this.router.navigate(['/login']);
      },
      error: error => {
        console.error('Errore nella registrazione', error);
      }
    });

  }
}
