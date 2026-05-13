/**
 * Keycloak client row from GET /identity/products/{realm}.
 * Dropdown shows {@link ProductOption.label}; form control stores {@link ProductOption.clientId}.
 */
export interface ProductOption {
  clientId: string;
  label: string;
}

export function productRowToOption(p: any): ProductOption | null {
  if (typeof p === 'string') {
    const clientId = p.trim();
    return clientId ? { clientId, label: clientId } : null;
  }

  const clientId = String(p?.clientId ?? p?.productId ?? p?.name ?? p?.id ?? '').trim();
  if (!clientId) {
    return null;
  }
  const nicename = p?.name != null && p.name !== clientId ? String(p.name).trim() : '';
  const label = nicename || clientId;
  return { clientId, label };
}
