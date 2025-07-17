import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { MessageModalService } from '../../../../core/services/messageModal.service';
import { FormValidationService } from '../../../../core/services/formValidation.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, FontAwesomeModule],
  providers: [provideNgxMask()],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
})
export class PersonalInfoComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private customerService = inject(CustomerService);
  private messageModalService = inject(MessageModalService);
  private formService = inject(FormValidationService);

  faEdit = faEdit;
  faFloppyDisk = faFloppyDisk;

  editInput = signal<boolean>(false);
  private currentEmail: string = '';
  customer = this.customerService.customer;

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
  });

  get nameIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'name');
  }

  get emailIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'email');
  }

  get telIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'tel');
  }

  get streetIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'street');
  }

  get houseNumberIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'houseNumber');
  }

  get neighborhoodIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'neighborhood');
  }

  get cityIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'city');
  }

  get stateIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'state');
  }

  get cepIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'cep');
  }

  get cpfIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'cpf');
  }

  ngOnInit() {
    this.currentEmail = this.customer()!.email;
    this.form.setValue({
      name: this.customer()!.name,
      email: this.customer()!.email,
      tel: this.customer()!.phoneNumber,
      street: this.customer()!.street,
      houseNumber: this.customer()!.houseNumber,
      complement: this.customer()!.complement,
      neighborhood: this.customer()!.neighborhood,
      city: this.customer()!.city,
      state: this.customer()!.state,
      cep: this.customer()!.cep,
      cpf: this.customer()!.cpf,
    });
  }

  toggleEdit() {
    this.editInput.update((prev) => !prev);
  }

  onSave() {
    if (this.form.invalid) {
      console.log('Form is invalid');
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

    this.customerService
      .editCustomerInfo(
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
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toggleEdit();

          if (this.currentEmail != enteredEmail) {
            this.authService.logout();
            this.router.navigate(['/auth/login']);

            this.messageModalService.buildSuccessMessage(
              'Suas informações foram alteradas com sucesso! Por favor, logue novamente.',
            );
            return;
          }

          this.messageModalService.buildSuccessMessage(
            'Suas informações foram alteradas com sucesso!',
          );
        },
      });
  }
}
