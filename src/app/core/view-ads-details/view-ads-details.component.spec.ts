import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdsDetailsComponent } from './view-ads-details.component';

describe('ViewAdsDetailsComponent', () => {
  let component: ViewAdsDetailsComponent;
  let fixture: ComponentFixture<ViewAdsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAdsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAdsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
