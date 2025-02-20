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
  claimedRewards: any[] = [];
  isEditing = false;
  newPassword: string = '';
  isLoading = true;  // 🔹 Aggiunto loader

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId() ?? 0;
  }

  ngOnInit(): void {
    this.http.get<any>(`/api/users/${this.clientId}`).subscribe({
      next: (data) => {
        console.log("Dati utente ricevuti:", data);
        this.user = data;
        this.isLoading = false; // 🔹 Dati caricati
      },
      error: (error) => {
        console.error('Errore nel recupero del profilo:', error);
        this.isLoading = false;
      }
    });

    this.http.get<any[]>(`/api/reward-claims/${this.clientId}`).subscribe({
      next: (data) => {
        this.claimedRewards = data;
      },
      error: (error) => {
        console.error('Errore nel recupero dei premi riscattati:', error);
      }
    });
  }

  toggleEditProfile(): void {
    this.isEditing = !this.isEditing;
  }

  updateProfile(): void {
    const updatedData = {
      username: this.user.username,
      email: this.user.email,
      password: this.newPassword.trim() ? this.newPassword : undefined // Passa solo la password se è stata cambiata
    };

    this.http.put(`/api/users/${this.clientId}`, updatedData).subscribe({
      next: (data) => {
        alert('✅ Profilo aggiornato con successo!');
        this.isEditing = false;
        this.newPassword = '';  // 🔹 Reset della password dopo l'aggiornamento
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento del profilo:', error);
        alert('❌ Errore nell\'aggiornamento del profilo');
      }
    });
  }

}
