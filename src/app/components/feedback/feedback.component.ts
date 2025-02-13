import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';


@Component({
  selector: 'app-feedback',
  standalone: false,

  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit{

feedbacks: any[] = [];
newFeedback = {
  clientId: 0,  // Evitiamo il null
  hotelId: 0,   // Evitiamo il null
  cleanlinessScore: 1,  // Valore minimo valido
  ruleComplianceScore: 1,  // Valore minimo valido
  behaviorScore: 1,  // Valore minimo valido
  respectedCheckInOut: true,
  comments: ''
};
isLoading = true;
errorMessage = '';

constructor(private feedbackService: FeedbackService) {}



ngOnInit(): void {
  const token = localStorage.getItem('token');
  let hotelId = 0;

  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica il JWT
    hotelId = decodedToken.hotelId || 0;
    this.newFeedback.hotelId = hotelId; // ✅ Assegniamo l'hotelId corretto
  }

  this.feedbackService.getFeedbackByHotel(hotelId).subscribe({
    next: (data) => {
      this.feedbacks = data;
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = 'Errore nel recupero dei feedback';
      this.isLoading = false;
    }
  });
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

      // ✅ Assicuriamoci che tutti i valori siano numeri validi e non null!
      this.newFeedback = {
        clientId: 0,
        cleanlinessScore: 1,
        ruleComplianceScore: 1,
        behaviorScore: 1,
        respectedCheckInOut: true,
        comments: '',
        hotelId: this.newFeedback.hotelId  // Manteniamo l'ID hotel
      };
    },
    error: () => {
      this.errorMessage = '❌ Errore nell\'invio del feedback.';
    }
  });
}

}



