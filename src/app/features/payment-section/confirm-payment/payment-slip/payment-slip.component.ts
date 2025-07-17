import { Component, inject, output, signal } from '@angular/core';
import { PaymentSlipService } from './payment-slip.service';

@Component({
  selector: 'app-payment-slip',
  standalone: true,
  templateUrl: './payment-slip.component.html',
  styleUrl: './payment-slip.component.scss',
})
export class PaymentSlipComponent {
  private paymentSlipService = inject(PaymentSlipService);

  slipCode = signal<string | null>(null);
  success = output<void>();

  onGeneratePaymentSlip() {
    this.paymentSlipService.generateCode().subscribe((response) => {
      this.slipCode.set(response.code);
    });
    this.success.emit();
  }
}
