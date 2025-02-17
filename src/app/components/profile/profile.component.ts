import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any = {};
  clientId: number;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId() ?? 0;
  }

  ngOnInit(): void {
    this.http.get<any>(`/api/users/${this.clientId}`).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Errore nel recupero del profilo:', error);
      }
    });
  }

  updateProfile(): void {
    this.http.put(`/api/users/${this.clientId}`, this.user).subscribe({
      next: () => {
        alert('✅ Profilo aggiornato con successo!');
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento del profilo:', error);
      }
    });
  }
}
