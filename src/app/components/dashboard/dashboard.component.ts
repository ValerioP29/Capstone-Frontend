import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent {




  constructor(private http: HttpClient, private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]); // ✅ Cambia pagina al click sul pulsante
  }
  ngAfterViewInit() {
    // Dopo il caricamento, attiva l'animazione delle sidebar aggiungendo la classe "active" al layout
    setTimeout(() => {
      const layout = document.getElementById('layout');
      if (layout) {
        layout.classList.add('active');
      }
    }, 100);

    // Animazione JS per il pulsante di ricerca
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        searchButton.classList.add('animate-search');
        // Rimuovi la classe dopo 300ms per far tornare il pulsante allo stato originale
        setTimeout(() => {
          searchButton.classList.remove('animate-search');
        }, 300);
      });
    }
  }
}

