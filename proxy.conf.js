const gatewayUrl =
  process.env.API_GATEWAY_URL ||
  `http://localhost:${process.env.PAXO_GATEWAY_LOCAL_PORT || '8085'}`;
const pythonFrontendUrl =
  process.env.PYTHON_FOUNDRY_FRONTEND_URL ||
  `http://localhost:${process.env.PAXO_PYTHON_FRONTEND_LOCAL_PORT || '4201'}`;

/** Populated by ./scripts/start-local-access.sh product UI forwards (ng serve dev). */
const PRODUCT_UI_PORT_FORWARDS = {
  'yatrify/testyatrify': 32102,
};

/** Create Product ZIP upload (backend + frontend). */
const LONG_PROXY_MS = 15 * 60 * 1000;
const uploadProxy = {
  proxyTimeout: LONG_PROXY_MS,
  timeout: LONG_PROXY_MS,
};

const productUiProxy = {
  context: (pathname) => pathname.startsWith('/product-ui/'),
  target: 'http://127.0.0.1',
  secure: false,
  changeOrigin: true,
  logLevel: 'debug',
  router: (req) => {
    const match = req.url.match(/^\/product-ui\/([^/]+)\/([^/]+)/);
    if (!match) {
      return 'http://127.0.0.1:65535';
    }
    const key = `${match[1]}/${match[2]}`;
    const port = PRODUCT_UI_PORT_FORWARDS[key];
    return port ? `http://127.0.0.1:${port}` : 'http://127.0.0.1:65535';
  },
  pathRewrite: (path) => {
    const match = path.match(/^\/product-ui\/[^/]+\/[^/]+(\/.*)?$/);
    if (!match) {
      return path;
    }
    return match[1] || '/';
  },
};

module.exports = [
  productUiProxy,
  {
    context: ['/identity'],
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    ...uploadProxy,
  },
  {
    context: ['/gateway'],
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    ...uploadProxy,
  },
  {
    context: ['/project'],
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    ...uploadProxy,
  },
  {
    context: ['/api/v1/project'],
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  {
    context: ['/python-foundry-api'],
    target: pythonFrontendUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/python-foundry-api': '/api',
    },
  },
];
