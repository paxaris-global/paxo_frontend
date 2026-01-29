/**
 * SSR-safe access to auth token. Use this instead of localStorage directly
 * so that server-side rendering does not throw "localStorage is not defined".
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('access_token');
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('access_token', token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
}

export function isLoggedIn(): boolean {
  return !!getStoredToken();
}

/** SSR-safe realm name storage (from GET /identity/realms/user). */
export function getStoredRealm(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('realm');
}

export function setStoredRealm(realm: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('realm', realm);
}

export function clearStoredRealm(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('realm');
}
