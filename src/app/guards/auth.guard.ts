import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { clearAuthState, getStoredToken, isStoredTokenExpired, setStoredRedirectUrl } from '../auth-storage';

/** Protects routes that require a token. Clears session and sends user home when unauthenticated. */
export const authGuard: CanActivateFn = (_route, state) => {
  const token = getStoredToken();
  if (token && !isStoredTokenExpired()) return true;

  if (token && typeof window !== 'undefined') {
    clearAuthState();
    sessionStorage.setItem('redirect_reason', 'unauthorized');
  }

  const returnUrl = state?.url || '/';
  setStoredRedirectUrl(returnUrl);

  const router = inject(Router);
  void router.navigate(['/'], { replaceUrl: true });
  return false;
};
