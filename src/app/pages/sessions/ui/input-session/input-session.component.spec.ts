import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSessionComponent } from './input-session.component';

describe('InputSessionComponent', () => {
  let component: InputSessionComponent;
  let fixture: ComponentFixture<InputSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
