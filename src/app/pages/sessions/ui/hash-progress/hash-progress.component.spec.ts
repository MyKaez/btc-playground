import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashProgressComponent } from './hash-progress.component';

describe('HashProgressComponent', () => {
  let component: HashProgressComponent;
  let fixture: ComponentFixture<HashProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
