import {
  Component,
  computed,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, CurrencyPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private productsService = inject(ProductsService);

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  imageServerPath = this.productsService.imageServerPath;
  groupedProducts = input<Product[][]>([]);

  groupedProductsHasPages = computed<boolean>(() => {
    return this.groupedProducts().length > 1;
  });

  currentIndex: number = 0;
  windowWidth: number = window.innerWidth;

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private swipeThreshold: number = 50;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0) this.onPrevSlide();
      else this.onNextSlide();
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  onNextSlide(): void {
    if (this.currentIndex < this.groupedProducts().length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  onPrevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.groupedProducts().length - 1;
    }
  }
}
