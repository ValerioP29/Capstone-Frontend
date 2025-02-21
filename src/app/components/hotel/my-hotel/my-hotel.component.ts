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
        console.log("🏨 Hotel ricevuti dal backend:", data); // ✅ Debug

        // Controlliamo se gli hotel hanno `imageUrl`
        data.forEach(hotel => {
          console.log(`🖼️ Hotel ID ${hotel.id} - Image URL:`, hotel.imageUrl);
        });

        this.hotels = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento degli hotel';
        this.isLoading = false;
      },
    });
  }


  onFileSelected(event: any, hotel: IHotel): void {
    this.selectedFiles[hotel.id] = event.target.files[0];
  }

  uploadHotelImage(event: Event, hotel: IHotel): void {
    event.preventDefault();
    const file = this.selectedFiles[hotel.id];

    if (file) {
      console.log("⏳ Inizio caricamento immagine:", file.name);

      this.hotelService.updateHotel(hotel.id, hotel.name, hotel.location, file).subscribe({
        next: (updatedHotel) => {
          console.log("✅ Hotel aggiornato con successo:", updatedHotel);

          // 🔄 Aggiorniamo direttamente l'URL dell'immagine nella lista senza refresh
          this.hotels = this.hotels.map(h =>
            h.id === updatedHotel.id ? { ...h, imageUrl: updatedHotel.imageUrl } : h
          );

          console.log("🔄 Lista aggiornata con la nuova immagine!", this.hotels);
        },
        error: () => {
          console.error("❌ Errore nell'aggiornamento dell'hotel.");
        }
      });
    }
  }

}
