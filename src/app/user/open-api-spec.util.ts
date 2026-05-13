/**
 * Pure helpers for OpenAPI 2/3 → role URL rows (method + path + optional summary).
 * Supported HTTP verbs match product-management HttpMethodType.
 */

export type OpenApiEndpointRow = {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  selected: boolean;
};

const SUPPORTED_METHODS = ['get', 'post', 'put', 'delete', 'patch'] as const;

export function extractOpenApiBaseUrl(spec: Record<string, unknown>): string {
  const servers = spec['servers'];
  if (Array.isArray(servers) && servers.length > 0) {
    const first = servers[0] as Record<string, unknown>;
    const url = first?.['url'];
    if (typeof url === 'string' && url.trim()) {
      return url.trim();
    }
  }
  const host = spec['host'];
  if (typeof host === 'string' && host.trim()) {
    const schemes = spec['schemes'];
    const scheme =
      Array.isArray(schemes) && typeof schemes[0] === 'string' ? schemes[0] : 'https';
    const basePath = spec['basePath'];
    const bp = typeof basePath === 'string' ? basePath : '';
    return `${scheme}://${host}${bp}`;
  }
  return '';
}

/**
 * Lists GET/POST/PUT/PATCH/DELETE operations under spec.paths (OpenAPI 2 or 3).
 */
export function parseOpenApiToEndpoints(spec: Record<string, unknown>): OpenApiEndpointRow[] {
  const paths = spec['paths'];
  if (!paths || typeof paths !== 'object') {
    return [];
  }

  const out: OpenApiEndpointRow[] = [];

  for (const path of Object.keys(paths as Record<string, unknown>)) {
    const pathItem = (paths as Record<string, unknown>)[path];
    if (!pathItem || typeof pathItem !== 'object') {
      continue;
    }
    const item = pathItem as Record<string, unknown>;

    for (const method of SUPPORTED_METHODS) {
      const rawOp = item[method];
      if (!rawOp || typeof rawOp !== 'object') {
        continue;
      }
      const operation = rawOp as { summary?: string; description?: string };
      out.push({
        method: method.toUpperCase(),
        path,
        summary: operation.summary,
        description: operation.description,
        selected: true,
      });
    }
  }

  return out;
}

/** Build payload rows for POST /project/roles/save-or-update */
export function endpointsToRoleUrlPayload(
  endpoints: OpenApiEndpointRow[],
  baseUrl: string
): Array<{ url: string; uri: string; httpMethod: string }> {
  const base = baseUrl.trim();
  return endpoints
    .filter((e) => e.selected)
    .map((endpoint) => ({
      url: base,
      uri: endpoint.path,
      httpMethod: endpoint.method,
    }));
}
