import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { getStoredToken, getStoredRedirectUrl, isStoredUserAdmin, normalizeProductRedirectUrl } from '../auth-storage';

/** For login/signup: redirect to dashboard when user already has a token. */
export const guestGuard: CanActivateFn = () => {
  const token = getStoredToken();
  if (!token) return true;

  const router = inject(Router);

  if (isStoredUserAdmin()) {
    router.navigate(['/dashboard']);
    return false;
  }

  const redirectUrl = normalizeProductRedirectUrl(getStoredRedirectUrl());
  if (redirectUrl) {
    if (/^https?:\/\//i.test(redirectUrl)) {
      window.location.href = redirectUrl;
    } else {
      router.navigateByUrl(redirectUrl);
    }
    return false;
  }

  // No user-specific redirect available: allow login page instead of forcing dashboard.
  return true;
};
