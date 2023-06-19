import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpAboutComponent } from './pop-up-about.component';

describe('PopUpAboutComponent', () => {
  let component: PopUpAboutComponent;
  let fixture: ComponentFixture<PopUpAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpAboutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
