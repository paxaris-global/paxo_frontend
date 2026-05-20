import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { clearAuthState } from '../auth-storage';
import { navigateToAppUrl } from '../utils/app-navigation.util';

/**
 * On 401 Unauthorized from any API call (e.g. GET /identity/users/{realm}):
 * clear token, realm, and base_url; set redirect reason; go to home (avoids wrong-port /login).
 */
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && typeof window !== 'undefined') {
        clearAuthState();
        sessionStorage.setItem('redirect_reason', 'unauthorized');
        navigateToAppUrl('/');
      }
      return throwError(() => err);
    })
  );
};
