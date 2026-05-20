/**
 * Turn Keycloak/backend URLs like `http://localhost/dashboard/...` (implicit port 80)
 * into an in-app path when the user is on `http://localhost:4200`, so reload and
 * router navigation stay on the same origin.
 */
export function coerceAppInternalRedirect(raw: string | null | undefined): string | null {
  if (!raw?.trim()) {
    return null;
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  if (typeof window === 'undefined') {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    const win = window.location;
    const localHostnames = new Set(['localhost', '127.0.0.1', win.hostname]);
    const sameLocalDev =
      localHostnames.has(parsed.hostname) &&
      localHostnames.has(win.hostname) &&
      parsed.protocol === win.protocol;

    const pathname = parsed.pathname || '/';
    const isPaxoShellPath =
      pathname === '/' ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/signup') ||
      pathname === '/products' ||
      pathname.startsWith('/products/');
    if (parsed.origin === win.origin) {
      return `${pathname}${parsed.search}${parsed.hash}`;
    }
    if (sameLocalDev && isPaxoShellPath) {
      return `${pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return null;
  }

  return trimmed;
}

/**
 * Full-page navigation that preserves the current origin (host + port).
 * Avoids `window.location.href = '/path'` which sends users to port 80 on localhost.
 */
export function navigateToAppUrl(target: string): void {
  if (typeof window === 'undefined' || !target?.trim()) {
    return;
  }

  const trimmed = target.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    window.location.assign(trimmed);
    return;
  }

  const internal = coerceAppInternalRedirect(trimmed);
  const path =
    internal?.startsWith('/') === true
      ? internal
      : trimmed.startsWith('/')
        ? trimmed
        : `/${trimmed}`;
  window.location.assign(`${window.location.origin}${path}`);
}
