import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlipPaymentComponent } from './payment-slip.component';

describe('SlipPaymentComponent', () => {
  let component: SlipPaymentComponent;
  let fixture: ComponentFixture<SlipPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlipPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlipPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
