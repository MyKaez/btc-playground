import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCardsComponent } from './participant-cards.component';

describe('ParticipantCardsComponent', () => {
  let component: ParticipantCardsComponent;
  let fixture: ComponentFixture<ParticipantCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
