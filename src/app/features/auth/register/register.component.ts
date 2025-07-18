import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerService } from '../../../core/services/customer.service';
import { MessageModalService } from '../../../core/services/messageModal.service';
import { FormValidationService } from '../../../core/services/formValidation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Exception } from '../../../models/exception.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private customerService = inject(CustomerService);
  private messageModalService = inject(MessageModalService);
  private formService = inject(FormValidationService);

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.minLength(6), Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    tel: new FormControl('', {
      validators: [Validators.minLength(11), Validators.required],
    }),
    street: new FormControl('', {
      validators: [Validators.required],
    }),
    houseNumber: new FormControl('', {
      validators: [Validators.required],
    }),
    complement: new FormControl(''),
    neighborhood: new FormControl('', {
      validators: [Validators.required],
    }),
    city: new FormControl('', {
      validators: [Validators.required],
    }),
    state: new FormControl('', {
      validators: [Validators.required],
    }),
    cep: new FormControl('', {
      validators: [Validators.minLength(8), Validators.required],
    }),
    cpf: new FormControl('', {
      validators: [Validators.minLength(11), Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  get nameIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'name');
  }

  get emailIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'email');
  }

  get telIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'tel');
  }
  get streetIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'street');
  }

  get houseNumberIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'houseNumber');
  }

  get neighborhoodIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'neighborhood');
  }

  get cityIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'city');
  }

  get stateIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'state');
  }

  get cepIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'cep');
  }

  get cpfIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'cpf');
  }

  get passwordIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'password');
  }

  get confirmPasswordIsInvalid(): boolean {
    return (
      this.form.controls.password.value !==
        this.form.controls.confirmPassword.value &&
      this.form.controls.confirmPassword.touched
    );
  }

  onSubmit(): void {
    if (this.form.invalid || this.confirmPasswordIsInvalid) {
      return;
    }

    const enteredName = this.form.value.name?.trim();
    const enteredEmail = this.form.value.email?.trim();
    const enteredTel = this.form.value.tel?.trim();
    const enteredStreet = this.form.value.street?.trim();
    const enteredHouseNumber = this.form.value.houseNumber?.trim();
    const enteredComplement = this.form.value.complement?.trim();
    const enteredNeighborhood = this.form.value.neighborhood?.trim();
    const enteredCity = this.form.value.city?.trim();
    const enteredState = this.form.value.state?.trim();
    const enteredCep = this.form.value.cep?.trim();
    const enteredCpf = this.form.value.cpf?.trim();
    const enteredPassword = this.form.value.password?.trim();

    this.customerService
      .createCustomer(
        enteredName!,
        enteredTel!,
        enteredStreet!,
        enteredHouseNumber!,
        enteredComplement!,
        enteredNeighborhood!,
        enteredCity!,
        enteredState!,
        enteredCep!,
        enteredCpf!,
        enteredEmail!,
        enteredPassword!,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageModalService.buildSuccessMessage(
            'Seu usuário foi criado com sucesso! Agora você só precisa logar com seus dados cadastrados.',
          );
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          const err: Exception = error.error;

          if (err.errorCode == 'DUPLICATE_FIELD') {
            this.messageModalService.buildErrorMessage(
              'Um ou mais campos já estão em uso. Por favor, verifique os dados inseridos e tente novamente.',
            );
          }
        },
      });
  }
}
