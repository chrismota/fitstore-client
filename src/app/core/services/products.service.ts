import { inject, Injectable, signal } from '@angular/core';

import { Product } from '../../models/product.model';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { SKIP_AUTH } from '../tokens/auth-context-token';
import { MessageModalService } from './messageModal.service';
import { Router } from '@angular/router';
import { Exception } from '../../models/exception.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private httpClient = inject(HttpClient);
  private messageModalService = inject(MessageModalService);
  private router = inject(Router);

  private _imageServerPath = signal<string>(
    'http://localhost:9090/fitstorebucket/',
  );
  imageServerPath = this._imageServerPath.asReadonly();

  loadProducts(): Observable<Product[][]> {
    return this.fetchProducts('http://localhost:8080/products').pipe(
      map((products) => {
        return this.groupProducts(products);
      }),
    );
  }

  private groupProducts(products: Product[]): Product[][] {
    const chunkSize = 12;
    const productChunks: Product[][] = [];

    for (let i = 0; i < products.length; i += chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }

    return productChunks;
  }

  loadRelatedProducts(category: string): Observable<Product[]> {
    return this.fetchProducts(
      `http://localhost:8080/products/category?category=${category}`,
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const err: Exception = error.error;

        if (err.errorCode === 'CATEGORY_NOT_FOUND') {
          this.messageModalService.buildErrorMessage(
            'Valor inválido para parâmetro de categoria.',
          );
        }
        return of([]);
      }),
    );
  }

  loadProductsBySubCategory(subCategory: string): Observable<Product[][]> {
    return this.fetchProducts(
      `http://localhost:8080/products/subcategory?subcategory=${subCategory.toUpperCase()}`,
    ).pipe(
      map((products) => {
        return this.groupProducts(products);
      }),
      catchError((error: HttpErrorResponse) => {
        const err: Exception = error.error;

        if (err.errorCode === 'SUB_CATEGORY_NOT_FOUND') {
          this.messageModalService.buildErrorMessage(
            'Valor inválido para parâmetro de subcategoria.',
          );
        }

        this.router.navigate(['/']);
        return EMPTY;
      }),
    );
  }

  searchProducts(name: string): Observable<Product[]> {
    return this.fetchProducts(
      'http://localhost:8080/products/search?name=' + name,
    );
  }

  private fetchProducts(url: string): Observable<Product[]> {
    return this.httpClient
      .get<{ products: Product[] }>(url, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(map((resData) => resData.products));
  }

  loadProduct(productId: string): Observable<Product> {
    return this.fetchProduct(
      `http://localhost:8080/products/${productId}`,
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const err: Exception = error.error;

        if (err.errorCode === 'RESOURCE_NOT_FOUND') {
          this.messageModalService.buildErrorMessage(
            'Produto não encontrado. Por favor, tente novamente.',
          );
        }

        this.router.navigate(['/']);
        return EMPTY;
      }),
    );
  }

  private fetchProduct(url: string): Observable<Product> {
    return this.httpClient.get<Product>(url, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }
}
