import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
import { CustomerService } from '../../../core/services/customer.service';
import { MessageModalService } from '../../../core/services/messageModal.service';
import { CouponService } from './coupon.service';
import { Coupon } from '../../../models/coupon.model';
import { TotalSectionComponent } from '../../../shared/components/total-section/total-section.component';
import { WindowService } from '../../../core/services/window.service';
import { OrderService } from '../../../core/services/order.service';
import { ExceptionDto } from '../../../models/exception.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    TotalSectionComponent,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private customerService = inject(CustomerService);
  private messageModalService = inject(MessageModalService);
  private couponService = inject(CouponService);
  private windowService = inject(WindowService);
  private orderService = inject(OrderService);

  faTicket = faTicket;

  isLoading = signal<boolean>(true);

  imageServerPath = this.productsService.imageServerPath;
  customer = this.customerService.customer;

  loadedCoupons = signal<Coupon[]>([]);
  selectedCoupons = signal<Coupon[]>([]);
  couponListIsEmpty = computed<boolean>(() => {
    return this.loadedCoupons().length === 0 && !this.isLoading();
  });

  order = this.orderService.orderSignal;
  total = this.orderService.total;
  discountPercent = this.orderService.discountPercent;

  form = new FormGroup({
    paymentType: new FormControl('CREDIT_CARD', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.windowService.scrollToTop();

    if (!this.order()) {
      this.router.navigate(['/']);
    }

    this.orderService.setDiscountPercent(0);

    this.couponService
      .loadCoupons()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (coupons) => {
          this.loadedCoupons.set(coupons);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          const err: ExceptionDto = error.error;

          if (err.errorCode === 'INVALID_STATUS_VALUE') {
            this.messageModalService.buildErrorMessage(
              'Valor inválido para parâmetro de status.',
            );
          }
        },
      });
  }

  onSelectCode(coupon: Coupon, copyButton: HTMLButtonElement): void {
    const result = this.couponService.applyOrRemoveCoupon(
      this.selectedCoupons(),
      coupon,
      this.discountPercent(),
      this.total()!,
    );

    if (result.error) {
      this.messageModalService.buildErrorMessage(result.error);
      return;
    }

    this.selectedCoupons.set(result.updatedCoupons);
    this.orderService.setDiscountPercent(result.updatedDiscount);

    if (result.action === 'removed') {
      copyButton.innerText = 'Usar código';
      copyButton.style.backgroundColor = '#b31b1b';
    } else {
      copyButton.innerText = 'Usando código!';
      copyButton.style.backgroundColor = '#343a40';
    }
  }

  onSimulatePayment(): void {
    if (this.form.invalid) {
      return;
    }

    const couponsIds = this.selectedCoupons().map((coupon) => ({
      id: coupon.id,
    }));

    this.router.navigate(['/payment/confirm'], {
      state: {
        paymentType: this.form.controls.paymentType.value,
        couponsIds: couponsIds,
      },
    });
  }

  formatCpf(cpf: string | undefined): string {
    if (!cpf) return '';
    const digits = cpf.replace(/\D/g, '');
    return digits.length === 11
      ? digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
      : cpf;
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    return digits.length === 11
      ? digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
      : phone;
  }

  formatCep(cep: string | undefined): string {
    if (!cep) return '';
    const digits = cep.replace(/\D/g, '');
    return digits.length === 8
      ? digits.replace(/^(\d{5})(\d{3})$/, '$1-$2')
      : cep;
  }
}
