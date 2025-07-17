import { Injectable, signal, computed, inject } from '@angular/core';
import { WindowService } from '../../core/services/window.service';

@Injectable({ providedIn: 'root' })
export class PaginationService<T> {
  private windowService = inject(WindowService);
  private items = signal<T[]>([]);
  private itemsPerPage = signal<number>(9);
  private _currentPage = signal<number>(1);

  currentPage = this._currentPage.asReadonly();

  setItems(items: T[]): void {
    this.items.set(items);
    this._currentPage.set(1);
  }

  setItemsPerPage(count: number): void {
    this.itemsPerPage.set(count);
  }

  totalPages = computed<number>(() => {
    return Math.ceil(this.items().length / this.itemsPerPage());
  });

  paginatedItems = computed<T[]>(() => {
    const start = (this._currentPage() - 1) * this.itemsPerPage();
    return this.items().slice(start, start + this.itemsPerPage());
  });

  pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    const current = this._currentPage();
    const pages: number[] = [];

    let start: number;
    let end: number;

    if (total <= 3) {
      start = 1;
      end = total;
    } else if (current <= 2) {
      start = 1;
      end = 3;
    } else if (current >= total - 1) {
      start = total - 2;
      end = total;
    } else {
      start = current - 1;
      end = current + 1;
    }

    start = Math.max(start, 1);
    end = Math.min(end, total);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  changePage(page: number): void {
    this._currentPage.set(page);
    this.windowService.scrollToTop();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this._currentPage.update((page) => page + 1);
      this.windowService.scrollToTop();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this._currentPage.update((page) => page - 1);
      this.windowService.scrollToTop();
    }
  }
}
