import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TotalSectionComponent } from '../../../shared/components/total-section/total-section.component';
import { PaymentService } from '../payment/payment.service';
import { MessageModalService } from '../../../core/services/messageModal.service';
import { WindowService } from '../../../core/services/window.service';
import { CardPaymentComponent } from './card-payment/card-payment.component';
import { PixPaymentComponent } from './pix-payment/pix-payment.component';
import { PaymentSlipComponent } from './payment-slip/payment-slip.component';
import { OrderService } from '../../../core/services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionDto } from '../../../models/exception.model';

@Component({
  selector: 'app-confirm-payment',
  standalone: true,
  imports: [
    TotalSectionComponent,
    CardPaymentComponent,
    PixPaymentComponent,
    PaymentSlipComponent,
  ],
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.scss',
})
export class ConfirmPaymentComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private paymentService = inject(PaymentService);
  private messageModalService = inject(MessageModalService);
  private orderService = inject(OrderService);
  private windowService = inject(WindowService);

  showPaymentButton = signal<boolean>(false);
  order = this.orderService.orderSignal;
  paymentType = signal<string>(history.state.paymentType);
  couponsIds = signal<{ id: string }[]>(history.state.couponsIds);

  ngOnInit(): void {
    this.windowService.scrollToTop();

    if (!this.paymentType()) {
      this.router.navigate(['/']);
    }
  }

  isPaymentType(type: string): boolean {
    return this.paymentType() === type;
  }

  showButton(): void {
    this.showPaymentButton.set(true);
  }

  onFormValidityChange(isValid: boolean): void {
    this.showPaymentButton.set(isValid);
  }

  onSimulatePayment(): void {
    this.paymentService
      .createPayment(this.order()!.id, this.paymentType(), this.couponsIds())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.orderService.clearOrder();
          this.orderService.clearDiscountPercent();
          this.messageModalService.buildSuccessMessage(
            'Pagamento realizado com sucesso. Obrigado pela compra!',
          );
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          const err: ExceptionDto = error.error;

          if (err.errorCode === 'ORDER_EXPIRED') {
            this.messageModalService.buildErrorMessage(
              'Impossível fazer o pagamento do pedido pois ele expirou. Por favor, faça um novo pedido.',
            );
            this.router.navigate(['/']);
          } else if (err.errorCode === 'ORDER_NOT_FOUND') {
            this.messageModalService.buildErrorMessage(
              'Pedido não encontrado. Por favor, faça um novo pedido.',
            );
            this.router.navigate(['/']);
          } else if (err.errorCode === 'INVALID_ORDER') {
            this.messageModalService.buildErrorMessage(
              'O Pedido não se encontra mais disponível para pagamento.',
            );
            this.router.navigate(['/']);
          } else if (err.errorCode === 'COUPON_NOT_FOUND') {
            this.messageModalService.buildErrorMessage(
              'Um ou mais cupons não foram encontrados. Por favor, tente novamente.',
            );
            this.router.navigate(['/payment']);
          } else if (err.errorCode === 'COUPON_EXPIRED') {
            this.messageModalService.buildErrorMessage(
              'Um ou mais cupons estão expirados.',
            );
            this.router.navigate(['/payment']);
          } else if (err.errorCode === 'COUPON_NOT_APPLICABLE') {
            this.messageModalService.buildErrorMessage(
              'O valor mínimo de um ou mais cupons são invalidos para esse pedido.',
            );
            this.router.navigate(['/payment']);
          } else if (err.errorCode === 'COUPON_LIMIT_EXCEEDED') {
            this.messageModalService.buildErrorMessage(
              'O desconto não pode ser maior que 100%.',
            );
            this.router.navigate(['/payment']);
          }
        },
      });
  }
}
