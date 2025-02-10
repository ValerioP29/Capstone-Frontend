import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IHotel } from '../models/i-hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:8080/api/hotels'; // Percorso API backend

  constructor(private http: HttpClient) {}

  // Ottieni gli hotel dell'utente loggato
  getMyHotels(): Observable<IHotel[]> {
    return this.http.get<IHotel[]>(`${this.apiUrl}/my-hotel`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Token JWT per autenticazione
    });
  }

  // Carica un nuovo hotel con immagine
  uploadHotel(
    name: string,
    location: string,
    ownerId: number,
    image: File | null
  ): Observable<IHotel> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('ownerId', ownerId.toString());
    if (image) {
      formData.append('image', image);
    }



    return this.http.post<IHotel>(`${this.apiUrl}`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Token JWT
    });
  }


  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log("➡️ Inviando immagine:", file.name);

    return this.http.post<{ imageUrl: string }>('http://localhost:8080/uploads/upload', formData).pipe(
      map(response => response.imageUrl), // Estrai il campo `imageUrl` dalla risposta
      tap({
        next: (url) => console.log("⬅️ Risposta ricevuta, URL:", url),
        error: (err) => console.error("❌ Errore nella richiesta:", err)
      })
    );
  }

}
