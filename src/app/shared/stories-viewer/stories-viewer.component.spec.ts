import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesViewerComponent } from './stories-viewer.component';

describe('StoriesViewerComponent', () => {
  let component: StoriesViewerComponent;
  let fixture: ComponentFixture<StoriesViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoriesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
