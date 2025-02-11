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

  uploadHotelImage(event: Event, hotel: IHotel): void {
    event.preventDefault();
    const file = this.selectedFiles[hotel.id];

    if (file) {
      console.log("⏳ Inizio caricamento immagine:", file.name);

      // Ora aggiorniamo l'intero hotel, non solo l'immagine
      this.hotelService.updateHotel(hotel.id, hotel.name, hotel.location, file).subscribe({
        next: (updatedHotel) => {
          console.log("✅ Hotel aggiornato con successo:", updatedHotel);

          // Aggiorniamo la lista con i nuovi dati (inclusa l'immagine)
          this.hotels = this.hotels.map(h =>
            h.id === updatedHotel.id ? updatedHotel : h
          );

          console.log("🔄 Lista aggiornata con la nuova immagine!");
        },
        error: () => {
          console.error("❌ Errore nell'aggiornamento dell'hotel.");
        }
      });
    }
  }

}
