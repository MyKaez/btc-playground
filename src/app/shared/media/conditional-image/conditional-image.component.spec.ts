import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalImageComponent } from './conditional-image.component';

describe('ConditionalImageComponent', () => {
  let component: ConditionalImageComponent;
  let fixture: ComponentFixture<ConditionalImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionalImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionalImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
