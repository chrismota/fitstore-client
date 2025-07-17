import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Payment } from '../../../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private httpClient = inject(HttpClient);

  createPayment(orderId: string, method: string, coupons: { id: string }[]) {
    return this.httpClient.post<Payment>(`http://localhost:8080/payments`, {
      orderId,
      method,
      coupons,
    });
  }
}
