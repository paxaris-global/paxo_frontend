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
/** SSR-safe redirect_url storage for post-login navigation. */
export function getStoredRedirectUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('redirect_url');
}
export function setStoredRedirectUrl(redirectUrl: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('redirect_url', redirectUrl);
}
export function clearStoredRedirectUrl(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('redirect_url');
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

/** Returns true when the token includes an admin role (case-insensitive). */
export function tokenHasAdminRole(token: string | null): boolean {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload) return false;

  const adminRoles = new Set(['admin', 'realm-admin']);
  return extractTokenRoles(payload).some((role) => adminRoles.has(role.toLowerCase()));
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
