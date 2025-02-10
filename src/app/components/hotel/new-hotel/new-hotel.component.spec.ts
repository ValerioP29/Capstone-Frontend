import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHotelComponent } from './new-hotel.component';

describe('NewHotelComponent', () => {
  let component: NewHotelComponent;
  let fixture: ComponentFixture<NewHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
