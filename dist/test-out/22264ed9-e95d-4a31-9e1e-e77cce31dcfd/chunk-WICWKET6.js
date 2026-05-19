import {
  __esm
} from "./chunk-V6FC2DIM.js";

// src/environments/environment.ts
function getApiGatewayBaseUrl() {
  if (typeof window === "undefined") {
    return "";
  }
  const port = window.location.port;
  const host = window.location.hostname;
  if (port === "4200" || port === "") {
    return "";
  }
  return `http://${host}:8085`;
}
var init_environment = __esm({
  "src/environments/environment.ts"() {
    "use strict";
  }
});

export {
  getApiGatewayBaseUrl,
  init_environment
};
//# sourceMappingURL=chunk-WICWKET6.js.map
