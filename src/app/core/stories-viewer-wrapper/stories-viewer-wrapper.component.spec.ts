import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesViewerWrapperComponent } from './stories-viewer-wrapper.component';

describe('StoriesViewerWrapperComponent', () => {
  let component: StoriesViewerWrapperComponent;
  let fixture: ComponentFixture<StoriesViewerWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesViewerWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoriesViewerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
