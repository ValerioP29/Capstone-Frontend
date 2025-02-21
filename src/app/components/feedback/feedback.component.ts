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
  feedbackSuccess: boolean = false;

  newFeedback = {
    clientId: 0,
    hotelId: 0,
    cleanlinessScore: 1,
    ruleComplianceScore: 1,
    behaviorScore: 1,
    respectedCheckInOut: true,
    comments: ''
  };
  ownerId: number = 0; // ✅ Aggiunto ownerId

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      this.newFeedback.hotelId = decodedToken.hotelId || 0;
      this.ownerId = decodedToken.id || 0; // ✅ Recupero ownerId
    }

    console.log("🔄 Recupero feedback per ownerId:", this.ownerId);
    this.loadFeedbacks(); // ✅ Carica i feedback all'avvio
  }

  // ✅ Metodo per recuperare i feedback lasciati dall'hotel
  loadFeedbacks(): void {
    if (!this.ownerId) {
      console.error("❌ Errore: ownerId non definito, impossibile recuperare feedback.");
      return;
    }

    this.feedbackService.getFeedbackByHotel(this.ownerId).subscribe({
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
        this.loadFeedbacks(); // ✅ Aggiorna la lista dopo l'invio
        this.newFeedback = {
          clientId: 0, cleanlinessScore: 1, ruleComplianceScore: 1, behaviorScore: 1,
          respectedCheckInOut: true, comments: '', hotelId: this.newFeedback.hotelId
        };
      },
      error: () => {
        this.errorMessage = '❌ Errore nell\'invio del feedback.';
      }
    });
    this.feedbackSuccess = true;

     // Nasconde il messaggio dopo 3 secondi
     setTimeout(() => {
      this.feedbackSuccess = false;
    }, 3000);
  }

}
