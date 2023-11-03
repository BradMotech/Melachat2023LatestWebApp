import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTypeOfUserComponent } from './choose-type-of-user.component';

describe('ChooseTypeOfUserComponent', () => {
  let component: ChooseTypeOfUserComponent;
  let fixture: ComponentFixture<ChooseTypeOfUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseTypeOfUserComponent]
    });
    fixture = TestBed.createComponent(ChooseTypeOfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
