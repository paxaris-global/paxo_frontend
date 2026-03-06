declare const globalThis: any;

const runtimeApiBaseUrl = globalThis?.__PAXO_ENV__?.API_GATEWAY_BASE_URL;

export const environment = {
  production: true,
  apiGatewayBaseUrl: runtimeApiBaseUrl || 'http://localhost:8085',
};
