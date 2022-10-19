import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocksizeComponent } from './blocksize.component';

describe('BlocksizeComponent', () => {
  let component: BlocksizeComponent;
  let fixture: ComponentFixture<BlocksizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocksizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocksizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
