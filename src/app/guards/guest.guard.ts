import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { getStoredToken } from '../auth-storage';

/** For login/signup: redirect to dashboard when user already has a token. */
export const guestGuard: CanActivateFn = () => {
  const token = getStoredToken();
  if (!token) return true;
  const router = inject(Router);
  router.navigate(['/dashboard']);
  return false;
};
