import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { clearStoredToken, clearStoredRealm } from '../auth-storage';

/**
 * On 401 Unauthorized from any API call: clear token and realm, then redirect to login.
 */
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        clearStoredToken();
        clearStoredRealm();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
