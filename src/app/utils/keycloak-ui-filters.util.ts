/**
 * Filters Keycloak Admin API lists for Paxo UI dropdowns.
 * Hides built-in realm clients (account, broker, …) and default account-client roles.
 */

/** Keycloak built-in clients — not tenant “products” for Users/Roles UI. */
export const BUILTIN_KEYCLOAK_CLIENT_IDS = new Set(
  [
    'account',
    'account-console',
    'admin-cli',
    'broker',
    'realm-management',
    'security-admin-console',
  ].map((s) => s.toLowerCase()),
);

/**
 * Default roles on Keycloak's `account` client (and similar account-console UX).
 * These are not app roles created by your admins for provisioned products.
 */
export const KEYCLOAK_ACCOUNT_DEFAULT_ROLE_NAMES = new Set(
  [
    'view-applications',
    'manage-consent',
    'manage-account-links',
    'view-consent',
    'delete-account',
    'manage-account',
    'view-profile',
    'view-groups',
    // Often present on the `broker` client when that client slips through
    'read-token',
  ].map((s) => s.toLowerCase()),
);

/**
 * Roles auto-created during realm signup on `{realm}-admin-product` (not via Roles tab).
 * Hide these so dropdowns show roles admins create explicitly for products.
 */
export const SIGNUP_AUTO_ADMIN_ROLE_NAMES = new Set(
  [
    'admin-management',
    'manage-realm',
    'manage-users',
    'manage-clients',
    'create-client',
    'impersonation',
  ].map((s) => s.toLowerCase()),
);

/** All Keycloak/system role names to hide from UI role dropdowns. */
export const HIDDEN_DEFAULT_ROLE_NAMES = new Set([
  ...KEYCLOAK_ACCOUNT_DEFAULT_ROLE_NAMES,
  ...SIGNUP_AUTO_ADMIN_ROLE_NAMES,
]);

export function clientIdFromProductRow(p: unknown): string {
  if (typeof p === 'string') {
    return p.trim();
  }
  if (p && typeof p === 'object') {
    const o = p as Record<string, unknown>;
    return String(o['clientId'] ?? o['productId'] ?? o['name'] ?? o['id'] ?? '').trim();
  }
  return '';
}

/** True if this client should appear in product dropdowns (Users / Roles / Assign URIs / …). */
export function isUserVisibleProductClient(clientId: string): boolean {
  const id = clientId.trim();
  if (!id) {
    return false;
  }
  return !BUILTIN_KEYCLOAK_CLIENT_IDS.has(id.toLowerCase());
}

/** Filter raw rows from GET /identity/products/{realm}. */
export function filterProductRowsForUi(rows: unknown[] | null | undefined): unknown[] {
  return (rows || []).filter((row) => isUserVisibleProductClient(clientIdFromProductRow(row)));
}

/** Filter role rows from GET …/products/{id}/roles (or equivalent). */
export function filterRoleRowsForUi(roles: unknown[] | null | undefined): unknown[] {
  return (roles || []).filter((r) => {
    if (!r || typeof r !== 'object') {
      return false;
    }
    const name = String((r as { name?: unknown }).name ?? '')
      .trim()
      .toLowerCase();
    return name.length > 0 && !HIDDEN_DEFAULT_ROLE_NAMES.has(name);
  });
}
