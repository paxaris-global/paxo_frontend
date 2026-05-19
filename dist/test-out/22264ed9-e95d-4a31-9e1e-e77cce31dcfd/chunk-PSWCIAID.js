import {
  __esm
} from "./chunk-V6FC2DIM.js";

// src/app/user/open-api-spec.util.ts
function extractOpenApiBaseUrl(spec) {
  const servers = spec["servers"];
  if (Array.isArray(servers) && servers.length > 0) {
    const first = servers[0];
    const url = first?.["url"];
    if (typeof url === "string" && url.trim()) {
      return url.trim();
    }
  }
  const host = spec["host"];
  if (typeof host === "string" && host.trim()) {
    const schemes = spec["schemes"];
    const scheme = Array.isArray(schemes) && typeof schemes[0] === "string" ? schemes[0] : "https";
    const basePath = spec["basePath"];
    const bp = typeof basePath === "string" ? basePath : "";
    return `${scheme}://${host}${bp}`;
  }
  return "";
}
function parseOpenApiToEndpoints(spec) {
  const paths = spec["paths"];
  if (!paths || typeof paths !== "object") {
    return [];
  }
  const out = [];
  for (const path of Object.keys(paths)) {
    const pathItem = paths[path];
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    const item = pathItem;
    for (const method of SUPPORTED_METHODS) {
      const rawOp = item[method];
      if (!rawOp || typeof rawOp !== "object") {
        continue;
      }
      const operation = rawOp;
      out.push({
        method: method.toUpperCase(),
        path,
        summary: operation.summary,
        description: operation.description,
        selected: true
      });
    }
  }
  return out;
}
function endpointsToRoleUrlPayload(endpoints, baseUrl) {
  const base = baseUrl.trim();
  return endpoints.filter((e) => e.selected).map((endpoint) => ({
    url: base,
    uri: endpoint.path,
    httpMethod: endpoint.method
  }));
}
var SUPPORTED_METHODS;
var init_open_api_spec_util = __esm({
  "src/app/user/open-api-spec.util.ts"() {
    "use strict";
    SUPPORTED_METHODS = ["get", "post", "put", "delete", "patch"];
  }
});

export {
  extractOpenApiBaseUrl,
  parseOpenApiToEndpoints,
  endpointsToRoleUrlPayload,
  init_open_api_spec_util
};
//# sourceMappingURL=chunk-PSWCIAID.js.map
