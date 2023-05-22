import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowOnlineUsersComponent } from './pow-online-users.component';

describe('PowOnlineUsersComponent', () => {
  let component: PowOnlineUsersComponent;
  let fixture: ComponentFixture<PowOnlineUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowOnlineUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowOnlineUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
