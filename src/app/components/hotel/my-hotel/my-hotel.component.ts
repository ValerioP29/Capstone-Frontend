import { Component, OnInit } from '@angular/core';
import { IHotel } from '../../../models/i-hotel';
import { HotelService } from '../../../services/hotel.service';


@Component({
  selector: 'app-my-hotel',
  standalone: false,
  templateUrl: './my-hotel.component.html',
  styleUrl: './my-hotel.component.scss'
})
export class MyHotelComponent implements OnInit {
  hotels: IHotel[] = [];
  isLoading = true;
  errorMessage = '';
  selectedFiles: { [hotelId: number]: File | null } = {};

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getMyHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento degli hotel';
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: any, hotelId: number): void {
    this.selectedFiles[hotelId] = event.target.files[0];
  }

  uploadHotelImage(event: Event, hotelId: number): void {
    event.preventDefault();
    const file = this.selectedFiles[hotelId];

    if (file) {
      console.log("Inizio caricamento" + file.name);
      this.hotelService.uploadImage(file).subscribe({
        next: (imageUrl) => {
          console.log("✅ Immagine caricata con successo:", imageUrl);
          console.log('🔗 URL ricevuto:', imageUrl);


          // Aggiorna l'hotel con la nuova immagine
          this.hotels = this.hotels.map(hotel =>
            hotel.id === hotelId ? { ...hotel, imageUrl } : hotel
          );
        },
        error: () => {
          console.error("❌ Errore nel caricamento dell'immagine.");
        }
      });
    }
  }
}
