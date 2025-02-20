import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-feedback-client',
  templateUrl: './feedback-client.component.html',
  styleUrls: ['./feedback-client.component.css'],
  standalone: false

})
export class FeedbackClientComponent implements OnInit, AfterViewInit {
  feedbacks: any[] = [];
  clientId: number;

  constructor(private http: HttpClient, private authService: AuthService, private renderer: Renderer2, private el: ElementRef) {
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
  getFeedbackClass(feedback: any) {
    const score = this.getTotalScore(feedback);
    if (score < 5) {
      return 'low-score'; // Rosso per punteggi bassi
    } else if (score >= 5 && score < 8) {
      return 'medium-score'; // Giallo per punteggi medi
    } else {
      return 'high-score'; // Verde per punteggi alti
    }
  }

  ngAfterViewInit(): void {
    const feedbackCards = this.el.nativeElement.querySelectorAll('.feedback-card');
    feedbackCards.forEach((card: HTMLElement, index: number) => {
      setTimeout(() => {
        this.renderer.addClass(card, 'animate-fade-in');
      }, 200 * index);
    });
  }

}
