import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpaComponent } from './xpa.component';

describe('XpaComponent', () => {
  let component: XpaComponent;
  let fixture: ComponentFixture<XpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XpaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
