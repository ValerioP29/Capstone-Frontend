import { Component, OnInit } from '@angular/core';
import { IHotel } from '../../../models/i-hotel';
import { HotelService } from '../../../services/hotel.service';

@Component({
  selector: 'app-my-hotel',
  standalone: false,

  templateUrl: './my-hotel.component.html',
  styleUrl: './my-hotel.component.scss'
})
export class MyHotelComponent implements OnInit
{
   hotels: IHotel[] = [];
   isLoading = true;
   errorMessage = '';

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
}
