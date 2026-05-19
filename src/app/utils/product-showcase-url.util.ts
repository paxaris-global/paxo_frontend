const CLUSTER_HOSTS = new Set(['192.168.49.2', 'minikube', '127.0.0.1', 'localhost']);

function buildProxyPath(realmName: string, productId: string): string {
  return `/product-ui/${realmName.trim()}/${productId.trim()}/`;
}

/**
 * Resolves catalog "Open product" URLs for the browser.
 * Prefers same-origin Paxo proxy (/product-ui/...) so Open product works via localhost:4200.
 */
export function resolveProductFrontendUrl(
  raw: string | undefined | null,
  realmName?: string,
  productId?: string
): string {
  if (typeof window !== 'undefined' && realmName?.trim() && productId?.trim()) {
    const proxyPath = buildProxyPath(realmName, productId);
    const rawUrl = raw?.trim() ?? '';
    if (
      rawUrl.startsWith('/product-ui/') ||
      rawUrl.includes('127.0.0.1') ||
      rawUrl.includes('192.168.49.2') ||
      rawUrl.includes('.svc.cluster.local') ||
      !rawUrl
    ) {
      return new URL(proxyPath, window.location.origin).href;
    }
  }

  if (!raw?.trim()) {
    return '';
  }

  const trimmed = raw.trim();

  if (trimmed.startsWith('/product-ui/')) {
    if (typeof window !== 'undefined') {
      return new URL(trimmed, window.location.origin).href;
    }
    return trimmed;
  }

  const browserHost =
    (typeof window !== 'undefined' &&
      (window as Window & { __PAXO_PRODUCT_BROWSER_HOST__?: string })
        .__PAXO_PRODUCT_BROWSER_HOST__) ||
    '127.0.0.1';

  try {
    const url = new URL(trimmed);
    if (url.port && CLUSTER_HOSTS.has(url.hostname.toLowerCase())) {
      url.hostname = browserHost;
    }
    return url.href;
  } catch {
    return trimmed;
  }
}

/** Only use embedded screenshots in cards — never load live frontend URLs as images. */
export function resolveShowcasePreviewImage(
  preview: string | undefined | null,
  fallback: string
): string {
  if (!preview?.trim()) {
    return fallback;
  }
  const value = preview.trim();
  if (value.startsWith('data:image/')) {
    return value;
  }
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return fallback;
  }
  return fallback;
}
