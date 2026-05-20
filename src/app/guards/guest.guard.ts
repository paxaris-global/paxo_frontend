import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import {
  clearAuthState,
  getStoredRedirectUrl,
  getStoredToken,
  isStoredTokenExpired,
  isStoredUserAdmin,
  normalizeProductRedirectUrl,
} from '../auth-storage';
import { navigateToAppUrl } from '../utils/app-navigation.util';

/** For login/signup: redirect to dashboard when user already has a token. */
export const guestGuard: CanActivateFn = () => {
  const token = getStoredToken();
  if (!token) return true;

  if (isStoredTokenExpired()) {
    clearAuthState();
    return true;
  }

  const router = inject(Router);

  if (isStoredUserAdmin()) {
    void router.navigateByUrl('/dashboard/product/products');
    return false;
  }

  const redirectUrl = normalizeProductRedirectUrl(getStoredRedirectUrl());
  if (redirectUrl) {
    if (redirectUrl.startsWith('/')) {
      void router.navigateByUrl(redirectUrl);
    } else {
      navigateToAppUrl(redirectUrl);
    }
    return false;
  }

  // No user-specific redirect available: allow login page instead of forcing dashboard.
  return true;
};
