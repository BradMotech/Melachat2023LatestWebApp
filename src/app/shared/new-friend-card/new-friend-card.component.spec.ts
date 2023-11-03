import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFriendCardComponent } from './new-friend-card.component';

describe('NewFriendCardComponent', () => {
  let component: NewFriendCardComponent;
  let fixture: ComponentFixture<NewFriendCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewFriendCardComponent]
    });
    fixture = TestBed.createComponent(NewFriendCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
