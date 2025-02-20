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
      next: (data) => {
        console.log('Dati dei premi ricevuti:', data); // Aggiungi questo log per vedere tutta la risposta dell'API
        this.rewards = data;

        // Verifica i costi
        this.rewards.forEach(reward => {
          console.log('Costo premio', reward.pointsRequired);
        });
      },
      error: (error) => console.error('Errore nel recupero dei premi:', error)
    });


    // Recupera il punteggio del cliente
    this.http.get<{ totalScore: number }>(`/api/score/${this.clientId}`).subscribe({
      next: (data) => this.clientTotalScore = data.totalScore,
      error: (error) => console.error('Errore nel recupero del punteggio:', error)
    });
  }

  claimReward(rewardId: number) {
    this.http.post(`/api/reward-claims/${this.clientId}/${rewardId}`, {}).subscribe({
      next: () => {
        alert('🎉 Premio riscattato con successo!');
        // Fai una nuova chiamata per ottenere il punteggio aggiornato del cliente
        this.http.get<{ totalScore: number }>(`/api/score/${this.clientId}`).subscribe({
          next: (data) => {
            this.clientTotalScore = data.totalScore;  // Aggiorna il punteggio
          },
          error: (error) => alert('❌ Errore nel recupero del punteggio aggiornato: ' + error.error)
        });
      },
      error: (error) => alert('❌ Errore nel riscatto del premio: ' + error.error)
    });

  }
}
