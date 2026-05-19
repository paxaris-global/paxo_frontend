import {
  endpointsToRoleUrlPayload,
  extractOpenApiBaseUrl,
  init_open_api_spec_util,
  parseOpenApiToEndpoints
} from "./chunk-PSWCIAID.js";
import "./chunk-V6FC2DIM.js";

// src/app/user/open-api-spec.util.spec.ts
init_open_api_spec_util();
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
