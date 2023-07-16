import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDoneComponent } from './user-done.component';

describe('UserDoneComponent', () => {
  let component: UserDoneComponent;
  let fixture: ComponentFixture<UserDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
