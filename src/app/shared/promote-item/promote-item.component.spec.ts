import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteItemComponent } from './promote-item.component';

describe('PromoteItemComponent', () => {
  let component: PromoteItemComponent;
  let fixture: ComponentFixture<PromoteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoteItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromoteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
