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
  confirmPassword: string = '';  // 🔹 Aggiunto campo conferma password
  isLoading = true;
  passwordMismatch: boolean = false;  // 🔹 Flag per gestire errore di mismatch

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId() ?? 0;
  }

  ngOnInit(): void {
    this.http.get<any>(`/api/users/${this.clientId}`).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
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

  checkPasswordMatch(): void {
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
  }

  updateProfile(): void {
    if (this.passwordMismatch) {
      alert('❌ Le password non coincidono!');
      return;
    }

    const updatedData = {
      username: this.user.username,
      email: this.user.email,
      password: this.newPassword.trim() ? this.newPassword : undefined
    };

    this.http.put(`/api/users/${this.clientId}`, updatedData).subscribe({
      next: () => {
        alert('✅ Profilo aggiornato con successo!');
        this.isEditing = false;
        this.newPassword = '';
        this.confirmPassword = '';  // 🔹 Reset dei campi password
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento del profilo:', error);
        alert('❌ Errore nell\'aggiornamento del profilo');
      }
    });
  }
}
