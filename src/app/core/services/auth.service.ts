import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { MessageModalService } from './messageModal.service';
import { jwtDecode } from 'jwt-decode';
import { CustomerService } from './customer.service';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { Token } from '../../models/token.model';
import { Customer } from '../../models/customer.model';
import { CartService } from './cart.service';
import { Exception } from '../../models/exception.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private messageModalService = inject(MessageModalService);
  private customerService = inject(CustomerService);
  private cartService = inject(CartService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  private apiUrl: string = 'http://localhost:8080/auth';

  userIsAuthenticated = signal<boolean>(false);

  constructor() {
    this.userIsAuthenticated.set(!!localStorage.getItem(this._tokenKey()));
  }

  private _tokenKey = signal<string>('auth_token');

  getToken(): string | null {
    return localStorage.getItem(this._tokenKey());
  }

  login(email: string, password: string): Observable<Customer> {
    return this.httpClient
      .post<Token>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: Token) => {
          localStorage.setItem(this._tokenKey(), response.token);
          this.userIsAuthenticated.set(true);
        }),
        catchError((error: HttpErrorResponse) => {
          const err: Exception = error.error;

          if (err.errorCode == 'INVALID_CREDENTIALS') {
            this.messageModalService.buildErrorMessage(
              'Email ou senha inválidos',
            );
          }

          return EMPTY;
        }),
        switchMap((response) => {
          return this.customerService.getCustomer(response.token);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this._tokenKey());
    this.userIsAuthenticated.set(false);
    this.customerService.clearCustomer();
    this.cartService.clearCart();
    this.router.navigate(['/auth/login']);
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const exp = decoded.exp * 1000;
        return Date.now() > exp;
      } catch (error) {
        return true;
      }
    }
    return false;
  }

  checkSessionExpiration(): void {
    setInterval(() => {
      if (this.isTokenExpired()) {
        this.logout();
        this.messageModalService.buildErrorMessage(
          'Sua sessão expirou. Faça login novamente.',
        );
      }
    }, 5000);
  }
}
