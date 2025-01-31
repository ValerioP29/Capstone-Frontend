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
  // Valore di default per il role
  registerData = { username: '', email: '', password: '', role: 'ROLE_CLIENT' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.registerData).subscribe(
      response => {
        console.log('Registrazione riuscita', response);
        this.router.navigate(['/auth/login']); // Naviga alla pagina di login
      },
      error => {
        console.error('Errore nella registrazione', error);
      }
    );
  }
}
