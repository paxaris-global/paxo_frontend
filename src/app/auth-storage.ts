/**
 * SSR-safe access to auth token. Use this instead of localStorage directly
 * so that server-side rendering does not throw "localStorage is not defined".
 */
const TOKEN_KEY = 'token';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REALM_KEY = 'realm';
const CLIENT_ID_KEY = 'client_id';
const REDIRECT_URL_KEY = 'redirect_url';
const TOKEN_EXPIRES_AT_KEY = 'token_expires_at';
const LAST_ACTIVITY_AT_KEY = 'last_activity_at';
const BASE_URL_KEY = 'base_url';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}
export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
}
export function isLoggedIn(): boolean {
  const token = getStoredToken();
  if (!token) return false;
  return !isStoredTokenExpired();
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setStoredRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearStoredRefreshToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** SSR-safe realm name storage (from GET /identity/realms/user). */
export function getStoredRealm(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REALM_KEY);
}
export function setStoredRealm(realm: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REALM_KEY, realm);
}
export function clearStoredRealm(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REALM_KEY);
}

export function getStoredClientId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CLIENT_ID_KEY);
}

export function setStoredClientId(clientId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLIENT_ID_KEY, clientId);
}

export function clearStoredClientId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CLIENT_ID_KEY);
}

/** SSR-safe redirect_url storage for post-login navigation. */
export function getStoredRedirectUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REDIRECT_URL_KEY);
}
export function setStoredRedirectUrl(redirectUrl: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REDIRECT_URL_KEY, redirectUrl);
}
export function clearStoredRedirectUrl(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REDIRECT_URL_KEY);
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parseTokenExp(token: string): number | null {
  const payload = parseJwtPayload(token);
  if (!payload) return null;

  const expValue = payload['exp'];
  if (typeof expValue === 'number' && Number.isFinite(expValue)) {
    return expValue * 1000;
  }

  return null;
}

export function getStoredTokenExpiryAt(): number | null {
  if (typeof window === 'undefined') return null;
  const rawValue = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  if (!rawValue) return null;

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setStoredTokenExpiryAt(expiresAtMs: number): void {
  if (typeof window === 'undefined') return;
  if (!Number.isFinite(expiresAtMs)) return;
  localStorage.setItem(TOKEN_EXPIRES_AT_KEY, Math.floor(expiresAtMs).toString());
}

export function setStoredTokenExpiryFromToken(token: string): void {
  const expMs = parseTokenExp(token);
  if (expMs) {
    setStoredTokenExpiryAt(expMs);
  }
}

export function setStoredTokenExpiryFromExpiresIn(expiresInSeconds: number | undefined): void {
  if (typeof expiresInSeconds !== 'number' || !Number.isFinite(expiresInSeconds)) return;
  const expiresAt = Date.now() + Math.max(0, expiresInSeconds) * 1000;
  setStoredTokenExpiryAt(expiresAt);
}

export function isStoredTokenExpired(leewaySeconds: number = 0): boolean {
  const token = getStoredToken();
  if (!token) return true;

  const expiresAt = getStoredTokenExpiryAt() ?? parseTokenExp(token);
  if (!expiresAt) return false;

  const threshold = Date.now() + Math.max(0, leewaySeconds) * 1000;
  return expiresAt <= threshold;
}

export function getStoredLastActivityAt(): number | null {
  if (typeof window === 'undefined') return null;
  const rawValue = localStorage.getItem(LAST_ACTIVITY_AT_KEY);
  if (!rawValue) return null;

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
}

export function touchStoredLastActivity(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_ACTIVITY_AT_KEY, Date.now().toString());
}

export function clearAuthState(): void {
  if (typeof window === 'undefined') return;
  clearStoredToken();
  clearStoredRefreshToken();
  clearStoredRealm();
  clearStoredClientId();
  clearStoredRedirectUrl();
  localStorage.removeItem(LAST_ACTIVITY_AT_KEY);
  localStorage.removeItem(BASE_URL_KEY);
}

function extractTokenRoles(payload: Record<string, unknown>): string[] {
  const roles = new Set<string>();

  const realmAccess = payload['realm_access'] as { roles?: unknown } | undefined;
  if (Array.isArray(realmAccess?.roles)) {
    realmAccess.roles.forEach((role) => {
      if (typeof role === 'string') roles.add(role);
    });
  }

  const resourceAccess = payload['resource_access'] as Record<string, { roles?: unknown }> | undefined;
  if (resourceAccess && typeof resourceAccess === 'object') {
    Object.values(resourceAccess).forEach((resource) => {
      if (Array.isArray(resource?.roles)) {
        resource.roles.forEach((role) => {
          if (typeof role === 'string') roles.add(role);
        });
      }
    });
  }

  const topLevelRoles = payload['roles'];
  if (Array.isArray(topLevelRoles)) {
    topLevelRoles.forEach((role) => {
      if (typeof role === 'string') roles.add(role);
    });
  }

  return Array.from(roles);
}

function normalizeRoleName(role: string): string {
  return role.trim().toLowerCase().replace(/^role_/, '');
}

/**
 * Returns true only when the token contains the full realm-management role set
 * needed to treat the user as an internal dashboard admin.
 */
export function tokenHasAdminRole(token: string | null): boolean {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload) return false;

  // Require at least 3 out of 5 main admin roles (do not require 'admin' role)
  const requiredRoles = [
    'create-client',
    'impersonation',
    'manage-clients',
    'manage-realm',
    'manage-users',
  ];

  const userRoles = new Set(extractTokenRoles(payload).map((role) => normalizeRoleName(role)));
  let matchCount = 0;
  for (const role of requiredRoles) {
    if (userRoles.has(role)) matchCount++;
  }
  return matchCount >= 3;
}

/** Checks admin role from the currently stored token. */
export function isStoredUserAdmin(): boolean {
  return tokenHasAdminRole(getStoredToken());
}

/**
 * Accepts only app-internal redirects to avoid open-redirect issues.
 * - '/path?x=1' is accepted directly
 * - same-origin absolute URLs are normalized to '/path?x=1'
 */
export function normalizeRedirectUrl(rawUrl: string | null): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/')) return trimmed;
  if (typeof window === 'undefined') return null;

  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (parsed.origin !== window.location.origin) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

/**
 * Product-aware redirect normalizer.
 * Accepts:
 * - internal app paths: '/dashboard/client/users'
 * - absolute http/https URLs: 'https://product.example.com/callback'
 * - host:port without scheme: 'localhost:8095' (normalized to 'http://localhost:8095/')
 */
export function normalizeProductRedirectUrl(rawUrl: string | null): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('/')) return trimmed;
  if (typeof window === 'undefined') return null;

  // Absolute URL with explicit scheme.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (!/^https?:$/i.test(parsed.protocol)) return null;
      return parsed.toString();
    } catch {
      return null;
    }
  }

  // Common backend format without protocol, e.g. localhost:8095 or app.example.com:443/path.
  if (/^(localhost|[a-z0-9.-]+\.[a-z]{2,})(:\d+)?(\/.*)?$/i.test(trimmed)) {
    try {
      const parsed = new URL(`http://${trimmed}`);
      return parsed.toString();
    } catch {
      return null;
    }
  }

  // Last fallback: same-origin/internal-style normalization.
  return normalizeRedirectUrl(trimmed);
}
