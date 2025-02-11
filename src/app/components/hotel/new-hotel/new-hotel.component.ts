import { Component } from '@angular/core';
import { HotelService } from '../../../services/hotel.service';
import { IHotel } from '../../../models/i-hotel';

@Component({
  selector: 'app-new-hotel',
  templateUrl: './new-hotel.component.html',
  styleUrls: ['./new-hotel.component.scss'],
  standalone: false
})
export class NewHotelComponent {
  name: string = '';
  location: string = '';
  ownerId: number = 21; // Assicura che sia un numero e non null
  selectedFile: File | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private hotelService: HotelService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (!this.name || !this.location) {
      this.errorMessage = 'Compila tutti i campi richiesti!';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('location', this.location);
    formData.append('ownerId', this.ownerId.toString()); // Deve essere stringa
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Debug: stampiamo i valori prima di inviare
    formData.forEach((value, key) => {
      console.log(`📝 ${key}:`, value);
    });

    this.hotelService.uploadHotel(formData).subscribe({
      next: (response: IHotel) => {
        this.successMessage = 'Hotel caricato con successo!';
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Errore durante il caricamento!';
        this.successMessage = '';
        console.error("❌ ERRORE:", error);
      },
    });
  }
}
