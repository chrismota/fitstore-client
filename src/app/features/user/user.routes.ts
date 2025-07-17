import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';

export const USER_ROUTES: Routes = [
  {
    path: 'orders',
    component: UserOrdersComponent,
  },
  {
    path: 'profile',
    component: UserProfileComponent,
  },
];
