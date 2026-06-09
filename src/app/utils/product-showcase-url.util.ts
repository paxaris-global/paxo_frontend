function browserHost(): string {
  if (typeof window !== 'undefined') {
    const win = window as Window & { __PAXO_PRODUCT_BROWSER_HOST__?: string };
    const configured = win.__PAXO_PRODUCT_BROWSER_HOST__?.trim();
    if (configured) {
      return configured;
    }
    return window.location.hostname || '127.0.0.1';
  }
  return '127.0.0.1';
}

function browserOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return `http://${browserHost()}:4200`;
}

/** Same-origin path served by Paxo nginx: /product-ui/{realm}/{product}/ */
export function toProductUiPath(realmName?: string, productId?: string): string {
  const realm = (realmName ?? '').trim().toLowerCase();
  const product = (productId ?? '').trim().toLowerCase();
  if (!realm || !product) {
    return '';
  }
  return `/product-ui/${realm}/${product}/`;
}

function shouldRewriteHostForLocalBrowser(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === 'minikube' ||
    host === 'auto' ||
    host === 'minikube-auto'
  ) {
    return true;
  }
  if (host.endsWith('.svc.cluster.local') || host.endsWith('.svc')) {
    return true;
  }
  return false;
}

/**
 * Resolves catalog / create-product "Open" URLs for the browser.
 * Prefers Paxo proxy paths (/product-ui/...) on the current origin.
 */
export function resolveProductFrontendUrl(
  raw: string | undefined | null,
  realmName?: string,
  productId?: string
): string {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed && realmName && productId) {
    return `${browserOrigin()}${toProductUiPath(realmName, productId)}`;
  }
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('/product-ui/')) {
    return `${browserOrigin()}${trimmed.endsWith('/') ? trimmed : trimmed + '/'}`;
  }

  let toParse = trimmed;
  if (!toParse.startsWith('http://') && !toParse.startsWith('https://')) {
    if (toParse.includes('.svc.cluster.local')) {
      toParse = `http://${toParse}`;
    } else if (realmName && productId) {
      return `${browserOrigin()}${toProductUiPath(realmName, productId)}`;
    } else {
      return trimmed;
    }
  }

  try {
    const url = new URL(toParse);
    if (url.pathname.startsWith('/product-ui/')) {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}${url.pathname}${url.search}${url.hash}`;
      }
      return url.href;
    }
    if (realmName && productId) {
      return `${browserOrigin()}${toProductUiPath(realmName, productId)}`;
    }
    if (url.port && shouldRewriteHostForLocalBrowser(url.hostname)) {
      url.hostname = browserHost();
    }
    if (!url.pathname) {
      url.pathname = '/';
    }
    return url.href;
  } catch {
    if (realmName && productId) {
      return `${browserOrigin()}${toProductUiPath(realmName, productId)}`;
    }
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
