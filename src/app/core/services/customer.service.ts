import { effect, inject, Injectable, signal } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../../models/customer.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private httpClient = inject(HttpClient);

  private _imageServerPath = signal('http://localhost:9090/fitstorebucket/');
  imageServerPath = this._imageServerPath.asReadonly();

  private _customer = signal<Customer | null>(null);
  customer = this._customer.asReadonly();

  constructor() {
    this._loadCustomerFromStorage();
    this._syncToLocalStorage();
  }

  setLoggedCustomer(customer: Customer) {
    this._customer.set(customer);
  }

  clearCustomer() {
    this._customer.set(null);
    localStorage.removeItem('user');
  }

  private _loadCustomerFromStorage() {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored) as Customer;
      this._customer.set(parsed);
    }
  }

  private _syncToLocalStorage() {
    effect(() => {
      const user = this._customer();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    });
  }

  createCustomer(
    name: string,
    phoneNumber: string,
    street: string,
    houseNumber: string,
    complement: string | null,
    neighborhood: string,
    city: string,
    state: string,
    cep: string,
    cpf: string,
    email: string,
    password: string,
  ) {
    return this.httpClient.post<Customer>(`http://localhost:8080/customers`, {
      name,
      email,
      phoneNumber,
      street,
      houseNumber,
      complement,
      neighborhood,
      city,
      state,
      cep,
      cpf,
      role: 'CUSTOMER',
      password,
    });
  }

  editCustomerInfo(
    name: string,
    phoneNumber: string,
    street: string,
    houseNumber: string,
    complement: string | null,
    neighborhood: string,
    city: string,
    state: string,
    cep: string,
    cpf: string,
    email: string,
  ) {
    if (complement === '') complement = null;
    return this.httpClient
      .put<Customer>(`http://localhost:8080/customers/info`, {
        name,
        email,
        phoneNumber,
        street,
        houseNumber,
        complement,
        neighborhood,
        city,
        state,
        cep,
        cpf,
      })
      .pipe(
        tap((customer) => {
          this.setLoggedCustomer(customer);
        }),
      );
  }

  editCustomerPassword(currentPassword: string, newPassword: string) {
    return this.httpClient.put<Customer>(
      `http://localhost:8080/customers/password`,
      {
        currentPassword,
        newPassword,
      },
    );
  }

  getCustomer(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient
      .get<Customer>(`http://localhost:8080/customers`, { headers })
      .pipe(
        tap((customer) => {
          this.setLoggedCustomer(customer);
        }),
      );
  }

  uploadCustomerImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);

    return this.httpClient
      .post<Customer>('http://localhost:8080/image/customer/upload', formData)
      .pipe(
        tap((customer: Customer) => {
          this.setLoggedCustomer(customer);
        }),
      );
  }
}
