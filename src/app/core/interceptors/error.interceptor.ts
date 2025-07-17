import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageModalService } from '../services/messageModal.service';
import { ExceptionDto } from '../../models/exception.model';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageModal = inject(MessageModalService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const err: ExceptionDto = error.error;

      switch (err.errorCode) {
        case 'INTERNAL_ERROR':
          messageModal.buildErrorMessage(
            'Ocorreu um erro ao processar a requisição. Por favor, tente novamente.',
          );
          break;
        case 'CUSTOMER_NOT_FOUND':
          messageModal.buildErrorMessage(
            'Usuário não encontrado. Por favor, faça login novamente.',
          );
          if (authService.userIsAuthenticated()) {
            authService.logout();
          }
          router.navigate(['/auth/login']);
          break;
      }

      return throwError(() => error);
    }),
  );
};
