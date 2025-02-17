import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Reward } from '../../models/i-reward';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css'],
  standalone: false
})
export class RewardComponent implements OnInit {
  rewards: Reward[] = [];
  clientId: number;
  clientTotalScore: number = 0;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId() ?? 0;
  }


  ngOnInit(): void {
    // Recupera i premi disponibili
    this.http.get<Reward[]>('/api/rewards').subscribe({
      next: (data) => this.rewards = data,
      error: (error) => console.error('Errore nel recupero dei premi:', error)
    });

    // Recupera il punteggio del cliente
    this.http.get<{ totalScore: number }>(`/api/score/${this.clientId}`).subscribe({
      next: (data) => this.clientTotalScore = data.totalScore,
      error: (error) => console.error('Errore nel recupero del punteggio:', error)
    });
  }

  claimReward(rewardId: number) {
    this.http.post(`/api/rewards/${this.clientId}/claim/${rewardId}`, {}).subscribe({
      next: () => {
        alert('🎉 Premio riscattato con successo!');
        // Aggiorna il punteggio del cliente dopo il riscatto
        this.clientTotalScore -= this.rewards.find(r => r.id === rewardId)?.cost || 0;
      },
      error: (error) => alert('❌ Errore: ' + error.error)
    });
  }
}
