import { computed, inject, Injectable, signal, Signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../../models/cartItem.model';
import { Order } from '../../models/order.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private httpClient = inject(HttpClient);
  private storageKey = 'currentOrder';

  private orderSubject = new BehaviorSubject<Order | null>(this.loadOrder());
  order$ = this.orderSubject.asObservable();

  orderSignal: Signal<Order | null> = toSignal(this.order$, {
    initialValue: null,
  });

  setOrder(order: Order) {
    this.orderSubject.next(order);
    localStorage.setItem(this.storageKey, JSON.stringify(order));
  }

  clearOrder() {
    this.orderSubject.next(null);
    localStorage.removeItem(this.storageKey);
  }

  private loadOrder(): Order | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  private _discountPercent = signal<number>(this.loadDiscountPercent());
  discountPercent = this._discountPercent.asReadonly();

  setDiscountPercent(percent: number) {
    this._discountPercent.set(percent);
    localStorage.setItem('percent', JSON.stringify(percent));
  }

  clearDiscountPercent() {
    localStorage.removeItem('percent');
  }

  private loadDiscountPercent(): number {
    const stored = localStorage.getItem('percent');
    return stored ? JSON.parse(stored) : 0;
  }

  total = computed(() => this.orderSignal()?.totalValue);

  discountValue = computed(() => {
    return this.total()! * (this._discountPercent() / 100);
  });

  totalWithDiscount = computed(() => {
    return this.total()! - this.discountValue();
  });

  makeOrder(cart: CartItem[]) {
    const products = cart.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));

    return this.httpClient.post<Order>('http://localhost:8080/orders', {
      products,
    });
  }

  getOrders() {
    return this.httpClient
      .get<{ orders: Order[] }>('http://localhost:8080/orders')
      .pipe(
        map((resData) => {
          return resData.orders;
        }),
      );
  }

  getOrdersByStatus(status: 'PENDING' | 'PAID' | 'FAILED' | 'ALL') {
    if (status === 'ALL') {
      return this.getOrders();
    }

    return this.httpClient
      .get<{
        orders: Order[];
      }>(`http://localhost:8080/orders/status?status=${status}`)
      .pipe(
        map((resData) => {
          return resData.orders;
        }),
      );
  }
}
