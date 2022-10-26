import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationCardComponent } from './simulation-card.component';

describe('SimulationCardComponent', () => {
  let component: SimulationCardComponent;
  let fixture: ComponentFixture<SimulationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
