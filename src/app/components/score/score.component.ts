import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Score } from '../../models/i-score'; // ✅ Assicurati che il nome sia corretto

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css'],
  standalone: false
})
export class ScoreComponent implements OnInit {
  score: Score | null = null;
  clientId: number;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId() ?? 0;
  }

  ngOnInit(): void {
    console.log(`🔎 Sto recuperando il punteggio per clientId: ${this.clientId}`);

    this.http.get<Score>(`/api/score/${this.clientId}`).subscribe({
      next: (data) => {
        console.log("✅ Risposta API Score:", data);
        this.score = data; // ✅ Assegniamo direttamente l'oggetto Score
      },
      error: (error) => {
        console.error('❌ Errore nel recupero del punteggio:', error);
        console.log('📌 Errore dettagliato:', error.error);
      }
    });
  }

getTierClass(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'bronze': return 'tier-bronze';
    case 'silver': return 'tier-silver';
    case 'gold': return 'tier-gold';
    case 'platinum': return 'tier-platinum';
    default: return 'text-dark';
  }
}

getScoreMessage(totalScore: number): string {
  if (totalScore < 100) return '🔥 Sei all’inizio, continua a guadagnare punti!';
  if (totalScore < 500) return '🚀 Ottimo lavoro, continua così!';
  if (totalScore < 1000) return '💎 Sei un vero campione!';
  return '👑 Sei una leggenda! Il massimo del punteggio!';
}

getScoreMessageClass(totalScore: number): string {
  if (totalScore < 100) return 'alert-warning';
  if (totalScore < 500) return 'alert-info';
  if (totalScore < 1000) return 'alert-success';
  return 'alert-danger';
}

}
