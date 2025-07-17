import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './features/terms-of-use/terms-of-use.component';
import { ContactComponent } from './features/contact/contact.component';
import { AskedQuestionsComponent } from './features/asked-questions/asked-questions.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'asked-questions',
    component: AskedQuestionsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'terms-of-use',
    component: TermsOfUseComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products-section/products-section.routes').then(
        (m) => m.PRODUCTS_SECTION_ROUTES,
      ),
  },
  {
    path: 'payment',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/payment-section/payment-section.routes').then(
        (m) => m.PAYMENT_SECTION_ROUTES,
      ),
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./features/search/search.routes').then((m) => m.SEARCH_ROUTES),
  },
];
