import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpManagersComponent } from './pop-up-managers.component';

describe('PopUpManagersComponent', () => {
  let component: PopUpManagersComponent;
  let fixture: ComponentFixture<PopUpManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpManagersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
