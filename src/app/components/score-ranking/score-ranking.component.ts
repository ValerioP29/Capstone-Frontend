import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScoreService } from '../../services/score.service';
import Chart from 'chart.js/auto'; // Import corretto per Chart.js

@Component({
  selector: 'app-score-ranking',
  standalone: false,
  templateUrl: './score-ranking.component.html',
  styleUrl: './score-ranking.component.scss'
})
export class ScoreRankingComponent implements OnInit, AfterViewInit {
  scores: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  chart: any;
  hotelId: number = 0;

  constructor(private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.hotelId = this.getHotelIdFromToken(); // ✅ Inizializziamo hotelId

    if (!this.hotelId) {
      this.errorMessage = 'Errore: ID hotel non valido';
      this.isLoading = false;
      return;
    }

    console.log("🔄 Hotel ID recuperato:", this.hotelId); // ✅ Debug per confermare il valore

    // ✅ Facciamo una sola chiamata API con "all" all'inizio
    this.applyFilterWithDays("all");
  }

  ngAfterViewInit(): void {
    // Assicuriamoci che il grafico venga creato dopo che il DOM è stato caricato
    setTimeout(() => this.createChart(), 100);
  }

  getHotelIdFromToken(): number {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // FIX split `.`
        return decodedToken.hotelId || 0;
      } catch (error) {
        console.error("❌ Errore nel parsing del token:", error);
      }
    }
    return 0;
  }

  createChart(): void {
    const canvas = document.getElementById('scoreChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error("❌ Elemento Canvas non trovato!");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("❌ Impossibile ottenere il contesto 2D per il grafico!");
      return;
    }

    // Eliminare il grafico precedente se esiste
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.scores || this.scores.length === 0) {
      console.warn("⚠️ Nessun punteggio disponibile per creare il grafico.");
      return;
    }

    const labels = this.scores.map(s => s.username ? s.username : "Sconosciuto");

    const scores = this.scores.map(s => s.totalScore ?? 0);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Punteggio totale clienti',
          data: scores,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // ✅ Funzione che viene chiamata dal filtro HTML
  applyFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (!selectElement || !selectElement.value) return;

    this.applyFilterWithDays(selectElement.value); // ✅ Passiamo il valore alla funzione giusta
  }

  // ✅ Funzione che chiama l'API con il valore corretto
  applyFilterWithDays(days: string): void {
    let filterValue = days === "all" ? 0 : parseInt(days, 10); // ✅ Convertiamo la stringa in numero

    console.log(`🔍 Debug API Request: /api/score/hotel/${this.hotelId}?days=${filterValue}`);

    this.scoreService.getScoreByHotel(this.hotelId, filterValue).subscribe({
      next: (data) => {
        console.log("📊 Dati ricevuti per la classifica:", data); // ✅ Debug
    console.log(typeof data, Array.isArray(data)); //
        this.scores = data;
        this.isLoading = false;
        this.createChart(); // ✅ Ricarica il grafico con i nuovi dati
      },
      error: () => {
        this.errorMessage = "Errore nel recupero dei punteggi";
        this.isLoading = false;
      }
    });
  }
}
