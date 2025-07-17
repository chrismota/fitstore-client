import { Routes } from '@angular/router';
import { ProductsByTypeComponent } from './products-by-type/products-by-type.component';
import { ProductComponent } from './product/product.component';

export const PRODUCTS_SECTION_ROUTES: Routes = [
  {
    path: 'by-type',
    component: ProductsByTypeComponent,
  },
  {
    path: 'product/:productId',
    component: ProductComponent,
  },
];
