import {
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faArrowCircleLeft,
  faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { CurrencyPipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { WindowService } from '../../../core/services/window.service';
import { MessageModalService } from '../../../core/services/messageModal.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FontAwesomeModule, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private windowService = inject(WindowService);
  private messageModalService = inject(MessageModalService);

  faCartShopping = faCartShopping;
  faArrowCircleLeft = faArrowCircleLeft;
  faArrowCircleRight = faArrowCircleRight;

  productId = input.required<string>();
  productUnit = signal<number>(1);
  product = signal<Product | undefined>(undefined);
  relatedProducts = signal<Product[]>([]);
  imageServerPath = this.productsService.imageServerPath;

  relatedProductsIsEmpty = computed(() => {
    return this.relatedProducts().length === 0;
  });

  ngOnInit() {
    this.updateVisibleItems();

    this.productsService
      .loadProduct(this.productId())
      .pipe(
        switchMap((product) => {
          this.product.set(product);
          return this.productsService.loadRelatedProducts(product.category);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (relatedProducts) => {
          this.relatedProducts.set(relatedProducts);
        },
      });

    this.windowService.scrollToTop();
  }

  onAddToCart() {
    if (!this.authService.userIsAuthenticated()) {
      this.messageModalService.buildErrorMessage(
        'Faça login para adicionar produtos ao carrinho.',
      );
      return;
    }

    this.cartService.addToCart({
      id: this.product()!.id,
      name: this.product()!.name,
      price: this.product()!.price,
      imagePath: this.product()!.imagePath,
      quantity: this.productUnit(),
    });
  }

  onIncreaseUnit() {
    this.productUnit.update((unit) => unit + 1);
  }

  onDecreaseUnit() {
    if (this.productUnit() > 1) {
      this.productUnit.update((unit) => unit - 1);
    }
  }

  currentSlide = 0;
  translateX = 0;
  itemWidth = 245;
  visibleItems = 1;
  carouselWidth = 0;

  get prevButtonIsDisabled() {
    return this.currentSlide === 0;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisibleItems();
  }

  updateVisibleItems() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1200) this.visibleItems = 5;
    else if (screenWidth >= 992) this.visibleItems = 4;
    else if (screenWidth >= 768) this.visibleItems = 3;
    else if (screenWidth >= 500) this.visibleItems = 2;
    else this.visibleItems = 1;

    this.carouselWidth = this.loopedProducts().length * this.itemWidth;
    this.clampCurrentSlide();
    this.updateTranslateX();
  }

  maxSlide = computed(() => {
    const totalItems = this.relatedProducts().length || 0;
    return Math.max(totalItems - this.visibleItems, 0);
  });

  onNextSlide(container: HTMLElement) {
    this.currentSlide++;
    this.updateTranslateX();

    if (this.currentSlide >= (this.relatedProducts().length || 0)) {
      setTimeout(() => {
        this.disableTransition(container);
        this.currentSlide = 0;
        this.updateTranslateX();

        this.enableTransition(container);
      }, 500);
    }
  }

  onPrevSlide(container: HTMLElement) {
    if (this.currentSlide === 0) {
      this.disableTransition(container);
      this.currentSlide = this.relatedProducts().length || 0;
      this.updateTranslateX();

      this.enableTransition(container);

      requestAnimationFrame(() => {
        this.currentSlide--;
        this.updateTranslateX();
      });
    } else {
      this.currentSlide--;
      this.updateTranslateX();
    }
  }

  disableTransition(container: HTMLElement) {
    container.style.transition = 'none';
  }

  enableTransition(container: HTMLElement) {
    requestAnimationFrame(() => {
      container.style.transition = 'transform 0.5s ease';
    });
  }

  updateTranslateX() {
    this.translateX = -this.currentSlide * this.itemWidth;
  }

  clampCurrentSlide() {
    if (this.currentSlide > this.maxSlide()) {
      this.currentSlide = this.maxSlide();
    }
  }

  trackByProdutoId(index: number, product: Product) {
    return `${product.id}-${index}`;
  }

  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private swipeThreshold: number = 50;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(container: HTMLElement) {
    const deltaX = this.touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0) this.onPrevSlide(container);
      else this.onNextSlide(container);
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  loopedProducts = computed(() => {
    const products = this.relatedProducts();
    return products ? [...products, ...products] : [];
  });
}
