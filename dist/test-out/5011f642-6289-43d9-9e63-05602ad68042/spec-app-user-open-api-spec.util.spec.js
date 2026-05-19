import "./chunk-EVSPGG2W.js";

// src/app/user/open-api-spec.util.ts
var SUPPORTED_METHODS = ["get", "post", "put", "delete", "patch"];
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

// src/app/user/open-api-spec.util.spec.ts
describe("open-api-spec.util", () => {
  const openapi3Minimal = {
    openapi: "3.0.0",
    info: { title: "Test", version: "1.0.0" },
    servers: [{ url: "http://localhost:9090/api" }],
    paths: {
      "/pets": {
        get: { summary: "List pets" },
        post: { summary: "Create pet" }
      },
      "/pets/{id}": {
        get: { summary: "Get pet" },
        delete: { summary: "Remove pet" }
      }
    }
  };
  it("extractOpenApiBaseUrl reads servers[0].url for OpenAPI 3", () => {
    expect(extractOpenApiBaseUrl(openapi3Minimal)).toBe("http://localhost:9090/api");
  });
  it("extractOpenApiBaseUrl reads swagger 2 host", () => {
    const swagger2 = {
      swagger: "2.0",
      host: "api.example.com",
      basePath: "/v1",
      schemes: ["https"],
      paths: {}
    };
    expect(extractOpenApiBaseUrl(swagger2)).toBe("https://api.example.com/v1");
  });
  it("parseOpenApiToEndpoints expands paths and supported methods", () => {
    const rows = parseOpenApiToEndpoints(openapi3Minimal);
    expect(rows.length).toBe(4);
    const keys = rows.map((r) => `${r.method} ${r.path}`);
    expect(keys).toContain("GET /pets");
    expect(keys).toContain("POST /pets");
    expect(keys).toContain("GET /pets/{id}");
    expect(keys).toContain("DELETE /pets/{id}");
    expect(rows.every((r) => r.selected)).toBe(true);
  });
  it("parseOpenApiToEndpoints returns empty when paths missing", () => {
    expect(parseOpenApiToEndpoints({ info: {} })).toEqual([]);
  });
  it("endpointsToRoleUrlPayload builds save-or-update body", () => {
    const endpoints = [
      { method: "GET", path: "/pets", selected: true },
      { method: "POST", path: "/pets", selected: false }
    ];
    const payload = endpointsToRoleUrlPayload(endpoints, "http://localhost:8080");
    expect(payload).toEqual([
      { url: "http://localhost:8080", uri: "/pets", httpMethod: "GET" }
    ]);
  });
});
//# sourceMappingURL=spec-app-user-open-api-spec.util.spec.js.map
