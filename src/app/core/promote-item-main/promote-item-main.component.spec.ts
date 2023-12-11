import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteItemMainComponent } from './promote-item-main.component';

describe('PromoteItemMainComponent', () => {
  let component: PromoteItemMainComponent;
  let fixture: ComponentFixture<PromoteItemMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoteItemMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromoteItemMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
