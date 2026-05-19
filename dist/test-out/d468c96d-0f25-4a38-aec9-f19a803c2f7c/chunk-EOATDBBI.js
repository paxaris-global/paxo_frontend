import {
  environment,
  init_environment
} from "./chunk-WHVCLFVD.js";
import {
  HttpClient,
  HttpHeaders,
  clearAuthState,
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
  init_core,
  init_operators,
  init_tslib_es6,
  map
} from "./chunk-5VF64QHA.js";
import {
  __esm,
  __spreadValues
} from "./chunk-V6FC2DIM.js";

// src/app/services/keycloak.ts
var KeycloakService;
var init_keycloak = __esm({
  "src/app/services/keycloak.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    init_operators();
    init_auth_storage();
    init_environment();
    KeycloakService = class KeycloakService2 {
      http;
      baseUrl = environment.apiGatewayBaseUrl;
      constructor(http) {
        this.http = http;
      }
      // ---------- REALMS ----------
      getRealms() {
        return this.http.get(`${this.baseUrl}/identity/realms`);
      }
      // ---------- PRODUCTS ----------
      createProductWithFile(realm, product, backendZip, frontendZip, frontendBaseUrl) {
        const token = getStoredToken();
        const formData = new FormData();
        formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
        formData.append("backendZip", backendZip);
        formData.append("frontendZip", frontendZip);
        formData.append("frontendBaseUrl", frontendBaseUrl);
        return this.http.post(`${this.baseUrl}/identity/${realm}/products`, formData, {
          headers: token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : void 0
        });
      }
      getProducts(realm) {
        const token = getStoredToken();
        const headers = new HttpHeaders(__spreadValues({
          "Content-Type": "application/json"
        }, token ? { "Authorization": `Bearer ${token}` } : {}));
        if (realm) {
          return this.http.get(`${this.baseUrl}/identity/products/${realm}`, { headers }).pipe(map((products) => products.map((p) => p.productId || p.id || p.name || p)));
        }
        return this.http.get(`${this.baseUrl}/gateway/products`, { headers });
      }
      // ---------- LOGIN ----------
      login(realmName, username, password, clientId, clientSecret) {
        const url = `${this.baseUrl}/identity/${realmName}/login`;
        const payload = { username, password, client_id: clientId, client_secret: clientSecret || "" };
        const headers = new HttpHeaders({ "Content-Type": "application/json" });
        return this.http.post(url, payload, { headers }).pipe(map((response) => {
          if (response.access_token) {
            setStoredToken(response.access_token);
            setStoredTokenExpiryFromToken(response.access_token);
          }
          if (typeof response.expires_in === "number") {
            setStoredTokenExpiryFromExpiresIn(response.expires_in);
          }
          if (typeof response.refresh_token === "string" && response.refresh_token.trim()) {
            setStoredRefreshToken(response.refresh_token);
          }
          return response;
        }));
      }
      // ---------- SIGNUP ----------
      signup(formData) {
        const url = `${this.baseUrl}/identity/signup`;
        return this.http.post(url, formData);
      }
      // ---------- USERS ----------
      getUsers(realm) {
        const token = getStoredToken();
        const headers = new HttpHeaders(__spreadValues({
          "Content-Type": "application/json"
        }, token ? { "Authorization": `Bearer ${token}` } : {}));
        return this.http.get(`${this.baseUrl}/identity/users/${realm}`, { headers });
      }
      createUser(realm, payload) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const url = `${this.baseUrl}/identity/${realm}/users`;
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        });
        return this.http.post(url, payload, { headers });
      }
      // ---------- UPDATE USER ----------
      updateUser(realm, username, payload) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const url = `${this.baseUrl}/identity/users/${realm}/${username}`;
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        });
        return this.http.put(url, payload, { headers });
      }
      // ---------- DELETE USER ----------
      deleteUser(realm, username) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const url = `${this.baseUrl}/identity/users/${realm}/${username}`;
        const headers = new HttpHeaders({
          "Authorization": `Bearer ${token}`
        });
        return this.http.delete(url, { headers });
      }
      // ---------- ROLES ----------
      getRoles(realm, clientName) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const url = `${this.baseUrl}/identity/${realm}/clients/${clientName}/roles`;
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        });
        return this.http.get(url, { headers });
      }
      createRole(realm, clientId, payload) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const url = `${this.baseUrl}/identity/${realm}/clients/${clientId}/roles`;
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        });
        return this.http.post(url, payload, { headers });
      }
      /**
       * Create role with multiple URL/URI pairs
       * This method creates the role in Keycloak and then saves URL mappings to Project Manager
       */
      // ---------- CREATE ROLE ONLY (KEYCLOAK) ----------
      createRoleOnly(realm, productId, roleName, description) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        });
        const payload = [
          {
            name: roleName,
            description
          }
        ];
        const url = `${this.baseUrl}/identity/${realm}/products/${productId}/roles`;
        return this.http.post(url, payload, { headers });
      }
      // ---------- SAVE / UPDATE ROLE URL PERMISSIONS ----------
      saveRoleUrls(realm, clientId, roleName, urls) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        });
        const payload = {
          realmName: realm,
          productName: clientId,
          roleName,
          urls,
          token
        };
        console.log("Payload sent to save-or-update:", payload);
        return this.http.post(`${this.baseUrl}/project/roles/save-or-update`, payload, { headers });
      }
      assignRole(realm, username, productName, roleNames) {
        const token = getStoredToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const url = `${this.baseUrl}/identity/${realm}/users/${username}/products/${productName}/roles`;
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        });
        const payload = roleNames.map((name) => ({ name }));
        return this.http.post(url, payload, { headers });
      }
      // ---------- UPLOAD CLIENT ----------
      uploadClient(clientId, file) {
        const url = `${this.baseUrl}/gateway/clients/${clientId}/upload`;
        const formData = new FormData();
        formData.append("file", file);
        return this.http.post(url, formData);
      }
      // ---------- VALIDATE ACCESS ----------
      validateAccess(token, url) {
        const validateUrl = `${this.baseUrl}/identity/validate-access`;
        const headers = new HttpHeaders({
          "Content-Type": "application/json"
        });
        const payload = {
          accessToken: token,
          url
        };
        return this.http.post(validateUrl, payload, { headers });
      }
      // ---------- MAKE ACTUAL HTTP REQUEST (for testing) ----------
      makeHttpRequest(token, url, method) {
        let requestUrl = url;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          requestUrl = `${this.baseUrl}${url.startsWith("/") ? url : "/" + url}`;
        }
        const headers = new HttpHeaders(__spreadValues({
          "Authorization": `Bearer ${token}`
        }, method !== "GET" ? { "Content-Type": "application/json" } : {}));
        switch (method) {
          case "GET":
            return this.http.get(requestUrl, { headers, observe: "response" }).pipe(map((response) => ({ data: response.body, statusCode: response.status })));
          case "POST":
            return this.http.post(requestUrl, {}, { headers, observe: "response" }).pipe(map((response) => ({ data: response.body, statusCode: response.status })));
          case "PUT":
            return this.http.put(requestUrl, {}, { headers, observe: "response" }).pipe(map((response) => ({ data: response.body, statusCode: response.status })));
          case "DELETE":
            return this.http.delete(requestUrl, { headers, observe: "response" }).pipe(map((response) => ({ data: response.body, statusCode: response.status })));
          case "PATCH":
            return this.http.patch(requestUrl, {}, { headers, observe: "response" }).pipe(map((response) => ({ data: response.body, statusCode: response.status })));
          default:
            return this.http.get(requestUrl, { headers, observe: "response" }).pipe(map((response) => ({ data: response.body, statusCode: response.status })));
        }
      }
      // ---------- LOGOUT ----------
      logout() {
        clearAuthState();
        window.location.href = `${this.baseUrl}/identity/logout`;
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    KeycloakService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], KeycloakService);
  }
});

export {
  KeycloakService,
  init_keycloak
};
//# sourceMappingURL=chunk-EOATDBBI.js.map
