import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-feedback',
  standalone: false,
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  searchClientId: number | null = null; // 🔍 Filtro per ricerca cliente
  isLoading = true;
  errorMessage = '';

  newFeedback = {
    clientId: 0,
    hotelId: 0,
    cleanlinessScore: 1,
    ruleComplianceScore: 1,
    behaviorScore: 1,
    respectedCheckInOut: true,
    comments: ''
  };

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      this.newFeedback.hotelId = decodedToken.hotelId || 0;
    }

    this.loadFeedbacks();
  }

  // ✅ Metodo per recuperare i feedback lasciati dall'hotel
  loadFeedbacks(): void {
    this.feedbackService.getFeedbackByHotel(this.newFeedback.hotelId).subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel recupero dei feedback';
        this.isLoading = false;
      }
    });
  }

  // ✅ Metodo per filtrare feedback per cliente
  filteredFeedbacks(): any[] {
    if (this.searchClientId) {
      return this.feedbacks.filter(fb => fb.clientId === this.searchClientId);
    }
    return this.feedbacks;
  }

  submitFeedback(event: Event): void {
    event.preventDefault();

    if (!this.newFeedback.clientId || this.newFeedback.clientId === 0) {
      this.errorMessage = '⚠️ Seleziona un cliente valido!';
      return;
    }

    if (!this.newFeedback.hotelId || this.newFeedback.hotelId === 0) {
      this.errorMessage = '⚠️ Errore: ID hotel non valido.';
      return;
    }

    this.feedbackService.submitFeedback(this.newFeedback).subscribe({
      next: (response) => {
        console.log("✅ Feedback inviato con successo!", response);
        this.feedbacks.push(response);
        this.newFeedback = {
          clientId: 0, cleanlinessScore: 1, ruleComplianceScore: 1, behaviorScore: 1,
          respectedCheckInOut: true, comments: '', hotelId: this.newFeedback.hotelId
        };
      },
      error: () => {
        this.errorMessage = '❌ Errore nell\'invio del feedback.';
      }
    });
  }
}
