import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IHotel } from '../../models/i-hotel';
import { Score } from '../../models/i-score';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: false,
})
export class DetailsComponent implements OnInit {
  hotel: IHotel | null = null;
  topScorers: Score[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const hotelId = this.route.snapshot.paramMap.get('id');
    console.log('ID dell’hotel:', hotelId);
    if (hotelId) {
      this.fetchHotelDetails(hotelId);
      this.fetchTopScorers(hotelId);
    }
  }

  fetchHotelDetails(hotelId: string) {
    this.http.get<IHotel>(`http://localhost:8080/api/hotels/${hotelId}`)
      .subscribe(data => this.hotel = data);
  }

  fetchTopScorers(hotelId: string) {
    this.http.get<Score[]>(`http://localhost:8080/api/score/hotel/${hotelId}`)
      .subscribe(data => this.topScorers = data);
  }
}
