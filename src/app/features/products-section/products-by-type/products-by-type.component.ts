import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../models/product.model';
import { ProductsComponent } from '../../../shared/components/products/products.component';
import { MessageModalService } from '../../../core/services/messageModal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Exception } from '../../../models/exception.model';

@Component({
  selector: 'app-products-by-type',
  standalone: true,
  templateUrl: './products-by-type.component.html',
  styleUrl: './products-by-type.component.scss',
  imports: [ProductsComponent],
})
export class ProductsByTypeComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private productsService = inject(ProductsService);
  private messageModalService = inject(MessageModalService);
  private router = inject(Router);

  private subCategory = signal<string>('');
  title = signal<string>('');

  loading = signal<boolean>(true);
  groupedProducts = signal<Product[][]>([]);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          this.subCategory.set(params['subCategory']);
          this.title.set(params['title']);
          return this.productsService.loadProductsBySubCategory(
            this.subCategory(),
          );
        }),
      )
      .subscribe({
        next: (groupedProducts) => {
          this.groupedProducts.set(groupedProducts);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          const err: Exception = error.error;

          if (err.errorCode === 'SUB_CATEGORY_NOT_FOUND') {
            this.messageModalService.buildErrorMessage(
              'Categoria não encontrada. Por favor, busque por outra categoria.',
            );
            this.router.navigate(['/']);
          }
        },
      });
  }
}
