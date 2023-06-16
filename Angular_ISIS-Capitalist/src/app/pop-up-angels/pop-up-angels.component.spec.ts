import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpAngelsComponent } from './pop-up-angels.component';

describe('PopUpAngelsComponent', () => {
  let component: PopUpAngelsComponent;
  let fixture: ComponentFixture<PopUpAngelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpAngelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpAngelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
