import {
  environment,
  init_environment
} from "./chunk-WHVCLFVD.js";
import {
  HttpClient,
  HttpHeaders,
  getStoredToken,
  init_auth_storage,
  init_http,
  setStoredRefreshToken,
  setStoredToken,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken
} from "./chunk-NLLKBMSJ.js";
import {
  Injectable,
  __decorate,
  finalize,
  init_core,
  init_operators,
  init_tslib_es6,
  map,
  shareReplay
} from "./chunk-5VF64QHA.js";
import {
  __esm,
  __spreadValues
} from "./chunk-V6FC2DIM.js";

// src/app/services/api-gateway.service.ts
var ApiGatewayService;
var init_api_gateway_service = __esm({
  "src/app/services/api-gateway.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    init_operators();
    init_auth_storage();
    init_environment();
    ApiGatewayService = class ApiGatewayService2 {
      http;
      baseUrl = environment.apiGatewayBaseUrl;
      usersInFlight = /* @__PURE__ */ new Map();
      productsInFlight = /* @__PURE__ */ new Map();
      constructor(http) {
        this.http = http;
      }
      getAuthHeaders() {
        const token = getStoredToken();
        const headers = new HttpHeaders(__spreadValues({
          "Content-Type": "application/json"
        }, token ? { Authorization: `Bearer ${token}` } : {}));
        return headers;
      }
      requireToken() {
        const token = getStoredToken();
        if (!token)
          throw new Error("No authentication token found");
        return token;
      }
      /**
       * GET /identity/realms/user
       * Returns the current/default realm name as a plain string.
       */
      getRealmUser() {
        return this.http.get(`${this.baseUrl}/identity/realms/user`, {
          headers: this.getAuthHeaders(),
          responseType: "text"
        }).pipe(map((realm) => realm?.trim() || "Unknown Realm"));
      }
      // ─── Login (login token working) ─────────────────────────────────────────
      /**
       * POST /identity/{realm}/login
       * Body: { username, password, client_id }
       */
      login(realm, body) {
        const url = `${this.baseUrl}/identity/${realm}/login`;
        return this.http.post(url, body, {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        }).pipe(map((res) => {
          if (res.access_token) {
            setStoredToken(res.access_token);
            setStoredTokenExpiryFromToken(res.access_token);
          }
          if (typeof res.expires_in === "number") {
            setStoredTokenExpiryFromExpiresIn(res.expires_in);
          }
          if (typeof res.refresh_token === "string" && res.refresh_token.trim()) {
            setStoredRefreshToken(res.refresh_token);
          }
          return res;
        }));
      }
      refreshToken(realm, body) {
        const url = `${this.baseUrl}/identity/${realm}/refresh`;
        return this.http.post(url, body, {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        }).pipe(map((res) => {
          if (res.access_token) {
            setStoredToken(res.access_token);
            setStoredTokenExpiryFromToken(res.access_token);
          }
          if (typeof res.expires_in === "number") {
            setStoredTokenExpiryFromExpiresIn(res.expires_in);
          }
          if (typeof res.refresh_token === "string" && res.refresh_token.trim()) {
            setStoredRefreshToken(res.refresh_token);
          }
          return res;
        }));
      }
      // ─── Signup (signup Copy – JSON) ────────────────────────────────────────
      /**
       * POST /identity/signup
       * Body: SignupRequest (JSON)
       */
      signup(body) {
        const url = `${this.baseUrl}/identity/signup`;
        return this.http.post(url, body, {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        });
      }
      // ─── Signup + file (signup + file) ───────────────────────────────────────
      /**
       * POST /identity/signup
       * Form-data: data (JSON string), sourceZip (file)
       */
      signupWithFile(formData) {
        const url = `${this.baseUrl}/identity/signup`;
        return this.http.post(url, formData);
      }
      // ─── Get users (get users) ───────────────────────────────────────────────
      /**
       * GET /identity/users/{realm}
       * Header: Authorization: Bearer {token}
       * Deduplicated: repeated calls for the same realm while a request is in flight share one HTTP request.
       */
      getUsers(realm) {
        const existing = this.usersInFlight.get(realm);
        if (existing)
          return existing;
        const url = `${this.baseUrl}/identity/users/${realm}`;
        const req = this.http.get(url, { headers: this.getAuthHeaders() }).pipe(shareReplay(1), finalize(() => this.usersInFlight.delete(realm)));
        this.usersInFlight.set(realm, req);
        return req;
      }
      // ─── User creation (user creation) ──────────────────────────────────────
      /**
       * POST /identity/{realm}/users
       * Body: UserCreationRequest
       * Header: Authorization: Bearer {token}
       */
      createUser(realm, body) {
        this.requireToken();
        const url = `${this.baseUrl}/identity/${realm}/users`;
        return this.http.post(url, body, { headers: this.getAuthHeaders() });
      }
      // ─── Update user (update user) ──────────────────────────────────────────
      /**
       * PUT /identity/users/{realm}/{username}
       * Body: { firstName, lastName, email, enabled }
       * Header: Authorization: Bearer {token}
       */
      updateUser(realm, username, body) {
        this.requireToken();
        const url = `${this.baseUrl}/identity/users/${realm}/${username}`;
        return this.http.put(url, body, { headers: this.getAuthHeaders() });
      }
      // ─── Get clients (list clients for realm) ─────────────────────────────────
      /**
       * GET /identity/products/{realm}
       * Returns array of product objects; use productId for dropdown values.
       * Deduplicated: repeated calls for the same realm while in flight share one HTTP request.
       */
      getProducts(realm) {
        const existing = this.productsInFlight.get(realm);
        if (existing)
          return existing;
        const url = `${this.baseUrl}/identity/products/${realm}`;
        const req = this.http.get(url, {
          headers: this.getAuthHeaders()
        }).pipe(shareReplay(1), finalize(() => this.productsInFlight.delete(realm)));
        this.productsInFlight.set(realm, req);
        return req;
      }
      // ─── Get roles (get role) ────────────────────────────────────────────────
      /**
       * GET /identity/{realm}/products/{productId}/roles
       * Header: Authorization: Bearer {token}
       */
      getRoles(realm, productId) {
        const url = `${this.baseUrl}/identity/${realm}/products/${productId}/roles`;
        return this.http.get(url, { headers: this.getAuthHeaders() });
      }
      // ─── Role creation (role creation) ──────────────────────────────────────
      /**
       * POST /identity/{realm}/products/{productId}/roles
       * Body: [{ name, description, url, uri }]
       * Header: Authorization: Bearer {token}
       */
      createRoles(realm, productId, body) {
        this.requireToken();
        const url = `${this.baseUrl}/identity/${realm}/products/${productId}/roles`;
        return this.http.post(url, body, { headers: this.getAuthHeaders() });
      }
      // ─── Create product (create product) ───────────────────────────────────────
      /**
       * POST /identity/{realm}/products
       * Body: { productId, publicClient, urls }
       * Sends Bearer token when present (some backends require it).
       */
      createProduct(realm, body) {
        const url = `${this.baseUrl}/identity/${realm}/products`;
        return this.http.post(url, body, { headers: this.getAuthHeaders() });
      }
      /**
       * POST /identity/{realm}/users/{username}/products/{productName}/roles
       * Body: [{ name: "Role1" }]
       * Header: Authorization: Bearer {token}
       */
      assignRoleToUser(realm, username, productName, body) {
        this.requireToken();
        const url = `${this.baseUrl}/identity/${realm}/users/${username}/products/${productName}/roles`;
        return this.http.post(url, body, { headers: this.getAuthHeaders() });
      }
      // ─── URI check-access ────────────────────────────────────────────────────
      /**
       * GET {baseUrl}/{path} with Bearer token (e.g. GET /service2).
       * Used to test gateway URI access.
       */
      getWithAuth(path) {
        this.requireToken();
        const url = path.startsWith("http") ? path : `${this.baseUrl}/${path.replace(/^\//, "")}`;
        return this.http.get(url, { headers: this.getAuthHeaders() });
      }
      // ─── Validate access (if backend has /identity/validate-access) ───────────
      /**
       * POST /identity/validate-access
       * Body: { accessToken, url }
       */
      validateAccess(accessToken, url) {
        const endpoint = `${this.baseUrl}/identity/validate-access`;
        return this.http.post(endpoint, { accessToken, url }, {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        });
      }
      getRoleUrls(realm, client, roleName) {
        return this.http.post(`${this.baseUrl}/project/roles/get-urls`, {
          realmName: realm,
          productName: client,
          roleName
        });
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    ApiGatewayService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], ApiGatewayService);
  }
});

export {
  ApiGatewayService,
  init_api_gateway_service
};
//# sourceMappingURL=chunk-R5UM7S7V.js.map
