import { Component, inject, output, signal } from '@angular/core';
import { PixService } from './pix.service';

@Component({
  selector: 'app-pix-payment',
  standalone: true,
  templateUrl: './pix-payment.component.html',
  styleUrl: './pix-payment.component.scss',
})
export class PixPaymentComponent {
  private pixService = inject(PixService);

  success = output<void>();
  pixCode = signal<string | null>(null);

  onGeneratePix(): void {
    this.pixService.generatePixCode().subscribe((response) => {
      this.pixCode.set(response.code);
    });
    this.success.emit();
  }
}
