import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowOnlineComponent } from './pow-online.component';

describe('PowOnlineComponent', () => {
  let component: PowOnlineComponent;
  let fixture: ComponentFixture<PowOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowOnlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
