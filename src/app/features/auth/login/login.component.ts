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
  private formService = inject(FormValidationService);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'email');
  }

  get passwordIsInvalid(): boolean {
    return this.formService.getControlInvalidState(this.form, 'password');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const enteredEmail = this.form.value.email?.trim();
    const enteredPassword = this.form.value.password?.trim();

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
