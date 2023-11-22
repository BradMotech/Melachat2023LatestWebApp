import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCubeComponent } from './story-cube.component';

describe('StoryCubeComponent', () => {
  let component: StoryCubeComponent;
  let fixture: ComponentFixture<StoryCubeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoryCubeComponent]
    });
    fixture = TestBed.createComponent(StoryCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
