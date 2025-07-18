import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.model';
import { ProductsService } from '../../../core/services/products.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageModalService } from '../../../core/services/messageModal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Exception } from '../../../models/exception.model';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
})
export class UserOrdersComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  private productsService = inject(ProductsService);
  private messageModalService = inject(MessageModalService);

  imageServerPath = this.productsService.imageServerPath;
  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);
  selected = signal<'ALL' | 'PENDING' | 'FAILED' | 'PAID'>('ALL');

  orderIsEmpty = computed<boolean>(() => {
    return this.orders().length === 0;
  });

  ngOnInit(): void {
    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.loading.set(false);
        },
      });
  }

  onSelectOrder(selectedStatus: 'ALL' | 'PENDING' | 'FAILED' | 'PAID'): void {
    this.selected.set(selectedStatus);
    this.orderService
      .getOrdersByStatus(selectedStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
        },
        error: (error: HttpErrorResponse) => {
          const err: Exception = error.error;

          if ((err.errorCode = 'INVALID_STATUS_VALUE')) {
            this.messageModalService.buildErrorMessage(
              'Valor de status inválido.',
            );
          }
        },
      });
  }

  onGoToPayment(order: Order): void {
    this.orderService.setOrder(order);
    this.router.navigate(['/payment']);
  }

  isStatus(order: Order, status: string): boolean {
    return order.status === status;
  }

  isSelected(option: string): boolean {
    return this.selected() === option;
  }
}
