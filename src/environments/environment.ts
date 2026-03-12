export const environment = {
  production: false,
  // Keep empty so frontend uses relative paths (/identity, /project, /gateway).
  // In ng serve this is proxied by proxy.conf.json; in container mode nginx proxies these paths.
  apiGatewayBaseUrl: '',
};
