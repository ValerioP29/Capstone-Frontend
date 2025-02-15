import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent {




  constructor(private http: HttpClient, private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]); // ✅ Cambia pagina al click sul pulsante
  }
}
