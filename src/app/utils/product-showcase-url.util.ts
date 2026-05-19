const CLUSTER_HOSTS = new Set(['192.168.49.2', 'minikube']);

/**
 * Rewrites Minikube/cluster NodePort URLs so "Open product" works from the user's browser.
 */
export function resolveProductFrontendUrl(raw: string | undefined | null): string {
  if (!raw?.trim()) {
    return '';
  }

  const browserHost =
    (typeof window !== 'undefined' &&
      (window as Window & { __PAXO_PRODUCT_BROWSER_HOST__?: string })
        .__PAXO_PRODUCT_BROWSER_HOST__) ||
    '127.0.0.1';

  try {
    const url = new URL(raw.trim());
    if (url.port && CLUSTER_HOSTS.has(url.hostname.toLowerCase())) {
      url.hostname = browserHost;
    }
    return url.href;
  } catch {
    return raw.trim();
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
  return fallback;
}
