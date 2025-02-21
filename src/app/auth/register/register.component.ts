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
  registrationSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.registerData).subscribe({
      next: response => {
        console.log( response.message);

      },
      error: error => {
        console.error('Errore nella registrazione', error);
      }
    });
     this.registrationSuccess = true;

     setTimeout(() => {
      this.registrationSuccess = false;
      this.router.navigate(['/login']);
    }, 3000);
  }

}
