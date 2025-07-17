import { Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';

export const PAYMENT_SECTION_ROUTES: Routes = [
  {
    path: '',
    component: PaymentComponent,
  },
  {
    path: 'confirm',
    component: ConfirmPaymentComponent,
  },
];
