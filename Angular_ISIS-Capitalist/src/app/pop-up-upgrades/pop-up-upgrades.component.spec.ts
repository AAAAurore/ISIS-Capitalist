import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpUpgradesComponent } from './pop-up-upgrades.component';

describe('PopUpUpgradesComponent', () => {
  let component: PopUpUpgradesComponent;
  let fixture: ComponentFixture<PopUpUpgradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpUpgradesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpUpgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
