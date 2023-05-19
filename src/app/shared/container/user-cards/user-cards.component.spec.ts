import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardsComponent } from './user-cards.component';

describe('ParticipantCardsComponent', () => {
  let component: UserCardsComponent;
  let fixture: ComponentFixture<UserCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
