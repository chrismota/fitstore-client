import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormValidationService } from '../../../../core/services/formValidation.service';

@Component({
  selector: 'app-card-payment',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './card-payment.component.html',
  styleUrl: './card-payment.component.scss',
})
export class CardPaymentComponent {
  private formService = inject(FormValidationService);
  validStatusChange = output<boolean>();

  form = new FormGroup({
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(16),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    securityCode: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    expirationDate: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    cpfCnpj: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
    ]),
  });

  ngOnInit(): void {
    this.form.statusChanges.subscribe(() => {
      this.validStatusChange.emit(this.form.valid);
    });
  }

  get cardNumberIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'cardNumber');
  }

  get nameIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'name');
  }

  get securityCodeIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'securityCode');
  }

  get expirationDateIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'expirationDate');
  }

  get cpfCnpjIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'cpfCnpj');
  }
}
