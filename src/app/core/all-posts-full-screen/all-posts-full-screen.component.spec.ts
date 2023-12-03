import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPostsFullScreenComponent } from './all-posts-full-screen.component';

describe('AllPostsFullScreenComponent', () => {
  let component: AllPostsFullScreenComponent;
  let fixture: ComponentFixture<AllPostsFullScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPostsFullScreenComponent]
    });
    fixture = TestBed.createComponent(AllPostsFullScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
