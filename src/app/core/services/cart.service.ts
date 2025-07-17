import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../../models/cartItem.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartLocalStorageKey = signal('cart');
  cartLocalStorageValue = localStorage.getItem(this.cartLocalStorageKey());

  private _cart = signal<CartItem[]>(
    this.cartLocalStorageValue ? JSON.parse(this.cartLocalStorageValue) : [],
  );
  cart = this._cart.asReadonly();

  private _cartIsVisible = signal(false);
  private _cartIsFadingOut = signal(false);

  cartIsVisible = this._cartIsVisible.asReadonly();
  cartIsFadingOut = this._cartIsFadingOut.asReadonly();

  getCartTotal = computed(() => {
    return this._cart().reduce((acc, i) => acc + i.price * i.quantity, 0);
  });

  closeCartBox() {
    this._cartIsFadingOut.set(true);

    setTimeout(() => {
      this._cartIsVisible.set(false);
      this._cartIsFadingOut.set(false);
    }, 600);
  }

  private openCartBox() {
    this._cartIsVisible.set(true);
  }

  toggleVisibility() {
    if (this.cartIsVisible()) {
      this.closeCartBox();
    } else {
      this.openCartBox();
    }
  }

  addToCart(item: CartItem) {
    const prevCart = this._cart();

    if (prevCart.some((i) => i.id == item.id)) {
      this._cart.set(
        prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: item.quantity } : i,
        ),
      );
    } else {
      this._cart.set([...prevCart, item]);
    }

    this.saveCartInLocalStorage();

    if (!this.cartIsVisible()) {
      this.openCartBox();
    }
  }

  decreaseCartItemQuantity(item: CartItem) {
    const prevCart = this._cart();

    if (item.quantity === 1) {
      return;
    }

    this._cart.set(
      prevCart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
      ),
    );
    this.saveCartInLocalStorage();
  }

  increaseCartItemQuantity(item: CartItem) {
    const prevCart = this._cart();
    this._cart.set(
      prevCart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
    this.saveCartInLocalStorage();
  }

  removeCartItem(item: CartItem) {
    this._cart.set(this._cart().filter((i) => i.id !== item.id));

    if (this._cart().length === 0) {
      this.closeCartBox();
      localStorage.removeItem(this.cartLocalStorageKey());
      return;
    }

    this.saveCartInLocalStorage();
  }

  clearCart() {
    this._cart.set([]);
    localStorage.removeItem(this.cartLocalStorageKey());
  }

  private saveCartInLocalStorage() {
    localStorage.setItem(
      this.cartLocalStorageKey(),
      JSON.stringify(this._cart()),
    );
  }
}
