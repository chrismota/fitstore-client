import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsComponent } from '../../shared/components/products/products.component';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);

  loading = signal<boolean>(true);
  groupedProducts = signal<Product[][]>([]);

  ngOnInit(): void {
    this.productsService
      .loadProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (groupedProducts) => {
          this.groupedProducts.set(groupedProducts);
          this.loading.set(false);
        },
      });
  }
}
