import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotedTabsComponent } from './promoted-tabs.component';

describe('PromotedTabsComponent', () => {
  let component: PromotedTabsComponent;
  let fixture: ComponentFixture<PromotedTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotedTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
