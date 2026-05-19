const gatewayUrl =
  process.env.API_GATEWAY_URL ||
  `http://localhost:${process.env.PAXO_GATEWAY_LOCAL_PORT || '8085'}`;
const pythonFrontendUrl =
  process.env.PYTHON_FOUNDRY_FRONTEND_URL ||
  `http://localhost:${process.env.PAXO_PYTHON_FRONTEND_LOCAL_PORT || '4201'}`;

module.exports = {
  '/identity': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/gateway': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/project': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/api/v1/project': {
    target: gatewayUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/python-foundry-api': {
    target: pythonFrontendUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/python-foundry-api': '/api',
    },
  },
};
