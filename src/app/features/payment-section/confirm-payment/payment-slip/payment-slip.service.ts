import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentSlipService {
  generateCode(): Observable<{ code: string }> {
    const slipCode =
      Math.random().toString().slice(2, 14) +
      Math.random().toString().slice(2, 14);

    return of({
      code: slipCode,
    });
  }
}
