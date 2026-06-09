const gatewayUrl =
  process.env.API_GATEWAY_URL ||
  `http://localhost:${process.env.PAXO_GATEWAY_LOCAL_PORT || '8085'}`;
const pythonFrontendUrl =
  process.env.PYTHON_FOUNDRY_FRONTEND_URL ||
  `http://localhost:${process.env.PAXO_PYTHON_FRONTEND_LOCAL_PORT || '4201'}`;
/** Python Foundry API (FastAPI), not the standalone python_frontend app on :4201. */
const pythonFoundryApiUrl =
  process.env.PYTHON_FOUNDRY_API_URL ||
  `http://127.0.0.1:${process.env.PAXO_PYTHON_FOUNDRY_API_LOCAL_PORT || '8000'}`;

const paxoFrontendUrl =
  process.env.PAXO_FRONTEND_URL ||
  `http://127.0.0.1:${process.env.PAXO_FRONTEND_LOCAL_PORT || '4200'}`;

/** Create Product ZIP upload (backend + frontend). */
const LONG_PROXY_MS = 15 * 60 * 1000;
const uploadProxy = {
  proxyTimeout: LONG_PROXY_MS,
  timeout: LONG_PROXY_MS,
};

/** ng serve: forward /product-ui/* to port-forwarded Paxo nginx (routes to all product UIs). */
const productUiProxy = {
  context: (pathname) => pathname.startsWith('/product-ui/'),
  target: paxoFrontendUrl,
  secure: false,
  changeOrigin: true,
  logLevel: 'debug',
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
    target: pythonFoundryApiUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    proxyTimeout: LONG_PROXY_MS,
    timeout: LONG_PROXY_MS,
    pathRewrite: {
      '^/python-foundry-api': '/api',
    },
  },
];
