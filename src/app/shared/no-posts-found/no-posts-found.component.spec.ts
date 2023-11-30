import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPostsFoundComponent } from './no-posts-found.component';

describe('NoPostsFoundComponent', () => {
  let component: NoPostsFoundComponent;
  let fixture: ComponentFixture<NoPostsFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoPostsFoundComponent]
    });
    fixture = TestBed.createComponent(NoPostsFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
