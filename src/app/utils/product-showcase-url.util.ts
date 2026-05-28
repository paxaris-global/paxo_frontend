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
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) {
    return true;
  }
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    return true;
  }
  return false;
}

/** Resolves catalog "Open product" URLs for the browser (direct NodePort, not Paxo proxy). */
export function resolveProductFrontendUrl(
  raw: string | undefined | null,
  _realmName?: string,
  _productId?: string
): string {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('/product-ui/')) {
    return '';
  }

  let toParse = trimmed;
  if (!toParse.startsWith('http://') && !toParse.startsWith('https://')) {
    if (toParse.includes('.svc.cluster.local')) {
      toParse = `http://${toParse}`;
    } else {
      return trimmed;
    }
  }

  try {
    const url = new URL(toParse);
    if (url.port && shouldRewriteHostForLocalBrowser(url.hostname)) {
      url.hostname = browserHost();
    }
    if (!url.pathname) {
      url.pathname = '/';
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
