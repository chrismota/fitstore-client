import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../models/product.model';
import { MessageModalService } from '../../core/services/messageModal.service';
import { CartService } from '../../core/services/cart.service';
import { PaginationService } from './pagination.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CurrencyPipe, FontAwesomeModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private messageModalService = inject(MessageModalService);
  private cartService = inject(CartService);
  private paginationService = inject(PaginationService);
  private authService = inject(AuthService);

  faCartPlus = faCartPlus;

  name = signal<string>('');
  imageServerPath = this.productsService.imageServerPath;
  private products = signal<Product[]>([]);

  paginatedProducts = this.paginationService.paginatedItems;
  pageNumbers = this.paginationService.pageNumbers;
  currentPage = this.paginationService.currentPage;
  totalPages = this.paginationService.totalPages;

  prevButtonIsDisabled = computed<boolean>(() => {
    return this.currentPage() === 1;
  });

  nextButtonIsDisabled = computed<boolean>(() => {
    return this.currentPage() === this.totalPages();
  });

  pageNumbersIsEmpty = computed<boolean>(() => {
    return this.pageNumbers().length === 0;
  });

  paginatedProductsIsEmpty = computed<boolean>(() => {
    return this.paginatedProducts().length === 0;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.name.set(params['name']);
    });

    this.productsService
      .searchProducts(this.name())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.paginationService.setItems(products);
        },
      });
  }

  onAddToCart(product: Product): void {
    if (!this.authService.userIsAuthenticated()) {
      this.messageModalService.buildErrorMessage(
        'Faça login para adicionar produtos ao carrinho.',
      );
      return;
    }

    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imagePath: product.imagePath,
      quantity: 1,
    });
  }

  onChangePage(p: number): void {
    this.paginationService.changePage(p);
  }

  onNextPage(): void {
    this.paginationService.nextPage();
  }

  onPrevPage(): void {
    this.paginationService.prevPage();
  }

  buttonIsActive(page: number): boolean {
    return this.currentPage() === page;
  }
}
