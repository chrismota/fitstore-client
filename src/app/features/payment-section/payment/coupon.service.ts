import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Coupon } from '../../../models/coupon.model';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private httpClient = inject(HttpClient);

  loadCoupons() {
    return this.httpClient
      .get<{
        coupons: Coupon[];
      }>(`http://localhost:8080/coupons/status?status=VALID`)
      .pipe(
        map((resData) => {
          return resData.coupons;
        }),
        catchError(() => {
          return of([]);
        }),
      );
  }

  private couponExceedsTotal(total: number, minValue: number): boolean {
    return minValue > total ? true : false;
  }

  applyOrRemoveCoupon(
    currentCoupons: Coupon[],
    couponToToggle: Coupon,
    currentDiscount: number,
    totalPurchaseValue: number,
  ): {
    updatedCoupons: Coupon[];
    updatedDiscount: number;
    action?: 'applied' | 'removed';
    error?: string;
  } {
    const alreadyApplied = currentCoupons.some(
      (c) => c.id === couponToToggle.id,
    );

    if (alreadyApplied) {
      return {
        updatedCoupons: currentCoupons.filter(
          (c) => c.id !== couponToToggle.id,
        ),
        updatedDiscount: currentDiscount - couponToToggle.percentage,
        action: 'removed',
      };
    }

    if (this.couponExceedsTotal(totalPurchaseValue, couponToToggle.minValue)) {
      return {
        updatedCoupons: currentCoupons,
        updatedDiscount: currentDiscount,
        error: 'O pedido excede o valor mínimo requerido do cupom.',
      };
    }

    if (this.isDiscountLimitExceeded(currentDiscount, couponToToggle)) {
      return {
        updatedCoupons: currentCoupons,
        updatedDiscount: currentDiscount,
        error: 'O desconto não pode ser maior que 100%',
      };
    }

    return {
      updatedCoupons: [...currentCoupons, couponToToggle],
      updatedDiscount: currentDiscount + couponToToggle.percentage,
      action: 'applied',
    };
  }

  private isDiscountLimitExceeded(
    currentDiscount: number,
    newCoupon: Coupon,
  ): boolean {
    return currentDiscount + newCoupon.percentage >= 100;
  }
}
