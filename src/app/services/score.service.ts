import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'http://localhost:8080/api/score/';

  constructor(private http: HttpClient) {}

  getScoreByHotel(hotelId: number, days: number | null = null): Observable<any[]> {
    let url = `${this.apiUrl}hotel/${hotelId.toString().trim()}`;

    if (days !== null) {
      url += `?days=${days}`;
    }

    return this.http.get<any[]>(url, {
      headers: { Authorization: `${localStorage.getItem('token')}` }
    });
  }
}
