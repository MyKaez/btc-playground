import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationsComponent } from './simulations.component';

describe('SimulationsComponent', () => {
  let component: SimulationsComponent;
  let fixture: ComponentFixture<SimulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
