import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-feedback-client',
  templateUrl: './feedback-client.component.html',
  styleUrls: ['./feedback-client.component.css'],
  standalone: false

})
export class FeedbackClientComponent implements OnInit {
  feedbacks: any[] = [];
  clientId: number;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId() ?? 0;
  }

  ngOnInit(): void {
    this.http.get<any[]>(`/api/feedback/client/${this.clientId}`).subscribe({
      next: (data) => {
        this.feedbacks = data;
      },
      error: (error) => {
        console.error('Errore nel recupero dei feedback:', error);
      }
    });

  }
  getTotalScore(feedback: any): number {
    return feedback.cleanlinessScore + feedback.ruleComplianceScore + feedback.behaviorScore;
  }
}
