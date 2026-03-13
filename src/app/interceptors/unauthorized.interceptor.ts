import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { clearAuthState } from '../auth-storage';

/**
 * On 401 Unauthorized from any API call (e.g. GET /identity/users/{realm}):
 * clear token, realm, and base_url; set redirect reason; full-page redirect to login.
 */
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && typeof window !== 'undefined') {
        clearAuthState();
        sessionStorage.setItem('redirect_reason', 'unauthorized');
        window.location.href = '/login';
      }
      return throwError(() => err);
    })
  );
};
