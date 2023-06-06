import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpUnlocksComponent } from './pop-up-unlocks.component';

describe('PopUpUnlocksComponent', () => {
  let component: PopUpUnlocksComponent;
  let fixture: ComponentFixture<PopUpUnlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpUnlocksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpUnlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
