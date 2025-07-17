import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Payment } from '../../../models/payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private httpClient = inject(HttpClient);

  createPayment(
    orderId: string,
    method: string,
    coupons: { id: string }[],
  ): Observable<Payment> {
    return this.httpClient.post<Payment>(`http://localhost:8080/payments`, {
      orderId,
      method,
      coupons,
    });
  }
}
