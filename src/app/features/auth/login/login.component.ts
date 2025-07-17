import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { MessageModalService } from '../../../core/services/messageModal.service';
import { FormValidationService } from '../../../core/services/formValidation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageModalService = inject(MessageModalService);
  private formService = inject(FormValidationService);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'email');
  }

  get passwordIsInvalid() {
    return this.formService.getControlInvalidState(this.form, 'password');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;

    this.authService
      .login(enteredEmail!, enteredPassword!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
      });
  }
}
