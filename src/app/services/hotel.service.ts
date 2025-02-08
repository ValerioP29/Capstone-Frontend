import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHotel } from '../models/i-hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getMyHotels(): Observable<IHotel[]> {
    return this.http.get<IHotel[]>(`${this.apiUrl}/my-hotels`);
  }
}
