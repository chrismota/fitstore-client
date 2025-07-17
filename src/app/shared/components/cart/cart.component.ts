import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { faTrashCan, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ProductsService } from '../../../core/services/products.service';
import { CartItem } from '../../../models/cartItem.model';
import { OrderService } from '../../../core/services/order.service';
import { MessageModalService } from '../../../core/services/messageModal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionDto } from '../../../models/exception.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, FontAwesomeModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private productsService = inject(ProductsService);
  private messageModalService = inject(MessageModalService);

  faTimes = faTimes;
  faTrashCan = faTrashCan;

  cartIsFadingOut = this.cartService.cartIsFadingOut;
  cartItems = this.cartService.cart;
  total = this.cartService.getCartTotal;
  imageServerPath = this.productsService.imageServerPath;

  onMakeOrder(): void {
    this.orderService
      .makeOrder(this.cartItems())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          this.cartService.clearCart();
          this.cartService.closeCartBox();

          this.orderService.setOrder(order);
          this.router.navigate(['/payment']);
        },
        error: (error: HttpErrorResponse) => {
          const err: ExceptionDto = error.error;

          if (err.errorCode === 'RESOURCE_NOT_FOUND')
            this.messageModalService.buildErrorMessage(
              'Um ou mais produtos não foram encontrados. Por favor, tente novamente.',
            );
        },
      });
  }

  onDecreaseCartItemQuantity(item: CartItem): void {
    this.cartService.decreaseCartItemQuantity(item);
  }

  onIncreaseCartItemQuantity(item: CartItem): void {
    this.cartService.increaseCartItemQuantity(item);
  }

  onRemoveCartItem(item: CartItem): void {
    this.cartService.removeCartItem(item);
  }

  onCloseCartBox(): void {
    this.cartService.closeCartBox();
  }
}
