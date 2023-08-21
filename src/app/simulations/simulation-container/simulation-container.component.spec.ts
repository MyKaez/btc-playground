import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationContainerComponent } from './simulation-container.component';

describe('SimulationContainerComponent', () => {
  let component: SimulationContainerComponent;
  let fixture: ComponentFixture<SimulationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
