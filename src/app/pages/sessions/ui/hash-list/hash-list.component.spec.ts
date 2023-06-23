import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashListComponent } from './hash-list.component';

describe('HashListComponent', () => {
  let component: HashListComponent;
  let fixture: ComponentFixture<HashListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
