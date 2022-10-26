import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTheTeamComponent } from './about-the-team.component';

describe('AboutTheTeamComponent', () => {
  let component: AboutTheTeamComponent;
  let fixture: ComponentFixture<AboutTheTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutTheTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutTheTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
