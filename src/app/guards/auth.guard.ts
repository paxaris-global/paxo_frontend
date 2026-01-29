import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { getStoredToken } from '../auth-storage';

/** Protects routes that require a token. Redirects to login when no token. */
export const authGuard: CanActivateFn = () => {
  const token = getStoredToken();
  if (token) return true;
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};
