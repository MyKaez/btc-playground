import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VidComponent } from './vid.component';

describe('VidComponent', () => {
  let component: VidComponent;
  let fixture: ComponentFixture<VidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
