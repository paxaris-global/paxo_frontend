/**
 * Resolve at **request time** (not module load). SSR/build evaluated `environment` with no `window`,
 * which froze `apiGatewayBaseUrl` to '' and kept signup on :58851 → 403.
 *
 * Use same-origin URLs. In local dev, proxy.conf.js sends these to the port
 * configured by PAXO_GATEWAY_LOCAL_PORT; in Kubernetes, nginx proxies them to
 * the in-cluster gateway service.
 */
export function getApiGatewayBaseUrl(): string {
  return '';
}

export const environment = {
  production: false,
  /** Prefer {@link getApiGatewayBaseUrl} in services — getter avoids one-shot SSR snapshot. */
  get apiGatewayBaseUrl(): string {
    return getApiGatewayBaseUrl();
  },
  keycloakBaseUrl: '',
  keycloakRealm: '',
  keycloakClientId: '',
  appBaseUrl: '',
  githubOrg: '',
  /** Same-origin proxy to Python Foundry API. */
  pythonFoundryApiBaseUrl: '/python-foundry-api/v1',
};
