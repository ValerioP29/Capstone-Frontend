import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackClientComponent } from './feedback-client.component';

describe('FeedbackClientComponent', () => {
  let component: FeedbackClientComponent;
  let fixture: ComponentFixture<FeedbackClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
