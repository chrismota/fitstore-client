import { Component, DestroyRef, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerService } from '../../../../core/services/customer.service';
import { MessageModalService } from '../../../../core/services/messageModal.service';
import { FormValidationService } from '../../../../core/services/formValidation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Exception } from '../../../../models/exception.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private destroyRef = inject(DestroyRef);
  private customerService = inject(CustomerService);
  private messageModalService = inject(MessageModalService);
  private formService = inject(FormValidationService);

  faEdit = faEdit;
  faFloppyDisk = faFloppyDisk;

  form = new FormGroup({
    currentPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    newPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmNewPassword: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  get currentPasswordIsInvalid(): boolean {
    return this.formService.getControlInvalidState(
      this.form,
      'currentPassword',
    );
  }

  get newPasswordIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'newPassword');
  }

  get confirmNewPasswordIsInvalid(): boolean {
    return (
      this.form.controls.newPassword.value !==
        this.form.controls.confirmNewPassword.value &&
      this.form.controls.confirmNewPassword.touched
    );
  }

  onChangePassword(): void {
    if (this.form.invalid || this.confirmNewPasswordIsInvalid) {
      this.messageModalService.buildErrorMessage(
        'Preencha todos os campos corretamente!',
      );
      return;
    }

    const currentPassword = this.form.value.currentPassword;
    const newPassword = this.form.value.newPassword;

    this.customerService
      .editCustomerPassword(currentPassword!, newPassword!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageModalService.buildSuccessMessage(
            'Senha alterada com sucesso!',
          );

          this.form.reset();
        },
        error: (error: HttpErrorResponse) => {
          const err: Exception = error.error;

          if (err.errorCode === 'INCORRECT_CURRENT_PASSWORD') {
            this.messageModalService.buildErrorMessage(
              'Senha atual incorreta! Por favor, tente novamente.',
            );
          }
        },
      });
  }
}
