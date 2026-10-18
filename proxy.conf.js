const { execSync } = require('child_process');

const gatewayUrl =
  process.env.API_GATEWAY_URL ||
  `http://localhost:${process.env.PAXO_GATEWAY_LOCAL_PORT || '8085'}`;
/** Python Foundry API (FastAPI), not the standalone python_frontend app on :4201. */
const pythonFoundryApiUrl =
  process.env.PYTHON_FOUNDRY_API_URL ||
  `http://127.0.0.1:${process.env.PAXO_PYTHON_FOUNDRY_API_LOCAL_PORT || '8000'}`;

/** Create Product ZIP upload (backend + frontend) — allow long provisioning. */
const LONG_PROXY_MS = 60 * 60 * 1000; // 60 minutes
const uploadProxy = {
  proxyTimeout: LONG_PROXY_MS,
  timeout: LONG_PROXY_MS,
};

/** Cache realm/product → http://127.0.0.1:{nodePort} (hybrid: kubectl port-forward to NodePort). */
const productUiTargetCache = new Map();
/** Per-request /product-ui/{realm}/{product}/ base for HTML <base href> rewrite. */
const productUiBaseByReq = new WeakMap();

function parseProductUiPath(pathname) {
  const match = (pathname || '').match(/^\/product-ui\/([^/]+)\/([^/]+)/i);
  if (!match) {
    return null;
  }
  return {
    realm: match[1].toLowerCase(),
    product: match[2].toLowerCase(),
    basePath: `/product-ui/${match[1].toLowerCase()}/${match[2].toLowerCase()}/`,
  };
}

function resolveProductUiTarget(pathname) {
  const parsed = parseProductUiPath(pathname);
  if (!parsed) {
    return null;
  }
  const key = `${parsed.realm}/${parsed.product}`;
  if (productUiTargetCache.has(key)) {
    return productUiTargetCache.get(key);
  }
  const svc = `${parsed.realm}-admin-${parsed.product}-frontend`;
  try {
    const nodePort = execSync(
      `kubectl -n default get svc ${svc} -o jsonpath="{.spec.ports[0].nodePort}"`,
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    if (nodePort && /^\d+$/.test(nodePort)) {
      const target = `http://127.0.0.1:${nodePort}`;
      productUiTargetCache.set(key, target);
      return target;
    }
  } catch {
    // fall through
  }
  return null;
}

/**
 * Hybrid: /product-ui/{realm}/{product}/ → localhost NodePort
 * (start-hybrid-product-forwards.sh).
 *
 * Angular 20 Vite: use object-form proxy keys (array + function context is skipped).
 * Product apps ship with <base href="/"> — rewrite to the product-ui prefix so
 * assets resolve under /product-ui/{realm}/{product}/ instead of the Paxo SPA.
 */
function rewriteProductUiPath(path) {
  const rewritten = path.replace(/^\/product-ui\/[^/]+\/[^/]+/, '') || '/';
  return rewritten.startsWith('/') ? rewritten : `/${rewritten}`;
}

function rememberProductUiBase(req) {
  const path = (req.url || '').split('?')[0];
  const parsed = parseProductUiPath(path);
  if (parsed) {
    productUiBaseByReq.set(req, parsed.basePath);
  }
}

function attachProductUiHtmlBaseRewrite(proxy) {
  proxy.on('proxyRes', (proxyRes, req, res) => {
    const chunks = [];
    proxyRes.on('data', (chunk) => chunks.push(chunk));
    proxyRes.on('end', () => {
      let buffer = Buffer.concat(chunks);
      const contentType = String(proxyRes.headers['content-type'] || '');
      const basePath = productUiBaseByReq.get(req);
      if (basePath && contentType.includes('text/html')) {
        let html = buffer.toString('utf8');
        html = html.replace(
          /<base\s+href=["']\/["']\s*\/?>/i,
          `<base href="${basePath}">`
        );
        buffer = Buffer.from(html, 'utf8');
        proxyRes.headers['content-length'] = String(buffer.length);
      }
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      res.end(buffer);
    });
  });
}

/**
 * Resolve target per request. Vite does not honor webpack `router`; use bypass
 * to retarget when the NodePort differs from the default.
 */
function productUiBypass(req, res, options) {
  rememberProductUiBase(req);
  const path = (req.url || '').split('?')[0];
  const resolved = resolveProductUiTarget(path);
  if (resolved && options?.target && resolved !== String(options.target)) {
    options.target = resolved;
  }
  // undefined → continue proxying
}

/** Object form — Vite matches keys as path prefixes. */
module.exports = {
  '/product-ui': {
    target: 'http://127.0.0.1:32100',
    secure: false,
    changeOrigin: true,
    selfHandleResponse: true,
    bypass: productUiBypass,
    rewrite: rewriteProductUiPath,
    configure: attachProductUiHtmlBaseRewrite,
    proxyTimeout: LONG_PROXY_MS,
    timeout: LONG_PROXY_MS,
  },
  '/identity': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    ...uploadProxy,
  },
  '/gateway': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    ...uploadProxy,
  },
  '/project': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    ...uploadProxy,
  },
  '/api/v1/project': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
  },
  '/python-foundry-api': {
    target: pythonFoundryApiUrl,
    secure: false,
    changeOrigin: true,
    proxyTimeout: LONG_PROXY_MS,
    timeout: LONG_PROXY_MS,
    rewrite: (path) => path.replace(/^\/python-foundry-api/, '/api'),
  },
};
