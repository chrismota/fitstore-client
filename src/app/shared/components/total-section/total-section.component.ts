import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-total-section',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './total-section.component.html',
  styleUrl: './total-section.component.scss',
})
export class TotalSectionComponent {
  private orderService = inject(OrderService);

  total = this.orderService.total;
  discountPercent = this.orderService.discountPercent;
  totalWithDiscount = this.orderService.totalWithDiscount;
}
