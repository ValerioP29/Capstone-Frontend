import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-reward',
  standalone: false,

  templateUrl: './reward.component.html',
  styleUrl: './reward.component.scss'
})
export class RewardComponent implements OnInit {
  rewards: any[] = [];
  clientId: number;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId() ?? 0;
  }

  ngOnInit(): void {
    this.http.get<any[]>(`/api/rewards/client/${this.clientId}`).subscribe({
      next: (data) => {
        this.rewards = data;
      },
      error: (error) => {
        console.error('Errore nel recupero dei premi:', error);
      }
    });
  }

  redeemReward(rewardId: number) {
    this.http.post(`/api/rewards/redeem`, { clientId: this.clientId, rewardId }).subscribe({
      next: () => {
        alert('🎉 Premio riscattato con successo!');
        this.rewards = this.rewards.filter(r => r.id !== rewardId);
      },
      error: (error) => {
        console.error('Errore nel riscatto del premio:', error);
      }
    });
  }
}
