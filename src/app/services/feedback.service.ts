import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
private apiUrl= 'http://localhost:8080/api/feedback';

  constructor(private http: HttpClient) {}

  // ottieni feedback lasciato da un hotel
  getFeedbackByHotel(hotelId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/hotel/${hotelId}`, {
    headers: { Authorization: `${localStorage.getItem('token')}` }

  });
  }

  submitFeedback(feedbackData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, feedbackData, {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
  }
}
