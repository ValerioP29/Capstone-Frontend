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

    this.hotelService
      .uploadHotel(this.name, this.location, this.ownerId, this.selectedFile)
      .subscribe({
        next: (response: IHotel) => {
          this.successMessage = 'Hotel caricato con successo!';
          this.errorMessage = '';
        },
        error: (error: any) => {
          this.errorMessage = 'Errore durante il caricamento!';
          this.successMessage = '';
          console.error(error);
        },
      });
  }
}
