import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionJoinFormularComponent } from './session-join-formular.component';

describe('SessionJoinFormularComponent', () => {
  let component: SessionJoinFormularComponent;
  let fixture: ComponentFixture<SessionJoinFormularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionJoinFormularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionJoinFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
