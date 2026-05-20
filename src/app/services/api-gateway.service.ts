import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, finalize } from 'rxjs/operators';
import { filterProductRowsForUi, filterRoleRowsForUi } from '../utils/keycloak-ui-filters.util';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  SignupRequest,
  UserCreationRequest,
  CreateProductRequest,
  CreateRolesPayload,
  AssignRolePayload,
} from '../models';
import {
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken,
} from '../auth-storage';
import { getApiGatewayBaseUrl } from '../../environments/environment';
/**
 * API Gateway Service – mirrors Postman collection "api gateway".
 * Uses relative URLs so /identity and /gateway are proxied to the configured
 * local gateway port (see proxy.conf.js). Backend stays on localhost only (not on ngrok).
 * When the app is served via ngrok, API calls go same-origin through the dev
 * server. No backend deployment on ngrok is needed.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiGatewayService {
  private usersInFlight = new Map<string, Observable<any[]>>();
  private productsInFlight = new Map<string, Observable<Array<{ productId: string; [key: string]: any }>>>();
  constructor(private http: HttpClient) {}

  /** Gateway origin for API calls — must be resolved per request (SSR/random dev ports). */
  private gw(): string {
    return getApiGatewayBaseUrl();
  }
  private getAuthHeaders(): HttpHeaders {
    const token = getStoredToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
    return headers;
  }
  private requireToken(): string {
    const token = getStoredToken();
    if (!token) throw new Error('No authentication token found');
    return token;
  }
  /**
   * GET /identity/realms/user
   * Returns the current/default realm name as a plain string.
   */
  getRealmUser(): Observable<string> {
    return this.http.get(`${this.gw()}/identity/realms/user`, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    }).pipe(
      map((realm) => (realm?.trim() || 'Unknown Realm'))
    );
  }
  // ─── Login (login token working) ─────────────────────────────────────────
  /**
   * POST /identity/{realm}/login
   * Body: { username, password, client_id }
   */
  login(realm: string, body: LoginRequest): Observable<LoginResponse> {
    const url = `${this.gw()}/identity/${realm}/login`;
    return this.http.post<LoginResponse>(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      map((res) => {
        if (res.access_token) {
          setStoredToken(res.access_token);
          setStoredTokenExpiryFromToken(res.access_token);
        }
        if (typeof res.expires_in === 'number') {
          setStoredTokenExpiryFromExpiresIn(res.expires_in);
        }
        if (typeof res.refresh_token === 'string' && res.refresh_token.trim()) {
          setStoredRefreshToken(res.refresh_token);
        }
        return res;
      })
    );
  }

  refreshToken(realm: string, body: RefreshTokenRequest): Observable<LoginResponse> {
    const url = `${this.gw()}/identity/${realm}/refresh`;
    return this.http.post<LoginResponse>(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      map((res) => {
        if (res.access_token) {
          setStoredToken(res.access_token);
          setStoredTokenExpiryFromToken(res.access_token);
        }
        if (typeof res.expires_in === 'number') {
          setStoredTokenExpiryFromExpiresIn(res.expires_in);
        }
        if (typeof res.refresh_token === 'string' && res.refresh_token.trim()) {
          setStoredRefreshToken(res.refresh_token);
        }
        return res;
      })
    );
  }
  // ─── Signup (signup Copy – JSON) ────────────────────────────────────────
  /**
   * POST /identity/signup
   * Body: SignupRequest (JSON)
   */
  signup(body: SignupRequest): Observable<any> {
    const url = `${this.gw()}/identity/signup`;
    return this.http.post(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  // ─── Signup + file (signup + file) ───────────────────────────────────────
  /**
   * POST /identity/signup
   * Form-data: data (JSON string), sourceZip (file)
   */
  signupWithFile(formData: FormData): Observable<any> {
    const url = `${this.gw()}/identity/signup`;
    return this.http.post(url, formData);
  }
  // ─── Get users (get users) ───────────────────────────────────────────────
  /**
   * GET /identity/users/{realm}
   * Header: Authorization: Bearer {token}
   * Deduplicated: repeated calls for the same realm while a request is in flight share one HTTP request.
   */
  getUsers(realm: string): Observable<any[]> {
    const existing = this.usersInFlight.get(realm);
    if (existing) return existing;
    const url = `${this.gw()}/identity/users/${realm}`;
    const req = this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      shareReplay(1),
      finalize(() => this.usersInFlight.delete(realm))
    );
    this.usersInFlight.set(realm, req);
    return req;
  }
  // ─── User creation (user creation) ──────────────────────────────────────
  /**
   * POST /identity/{realm}/users
   * Body: UserCreationRequest
   * Header: Authorization: Bearer {token}
   */
  createUser(realm: string, body: UserCreationRequest): Observable<any> {
    this.requireToken();
    const url = `${this.gw()}/identity/${realm}/users`;
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── Update user (update user) ──────────────────────────────────────────
  /**
   * PUT /identity/users/{realm}/{username}
   * Body: { firstName, lastName, email, enabled }
   * Header: Authorization: Bearer {token}
   */
  updateUser(realm: string, username: string, body: any): Observable<any> {
    this.requireToken();
    const url = `${this.gw()}/identity/users/${realm}/${username}`;
    return this.http.put(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── Get clients (list clients for realm) ─────────────────────────────────
  /**
   * GET /identity/products/{realm}
   * Returns Keycloak client rows (clientId, name, …); map to UI with productRowToOption.
   * Deduplicated: repeated calls for the same realm while in flight share one HTTP request.
   */
  getProducts(realm: string): Observable<Array<{ clientId?: string; name?: string; productId?: string; [key: string]: any }>> {
    const existing = this.productsInFlight.get(realm);
    if (existing) return existing;
    const url = `${this.gw()}/identity/products/${realm}`;
    const req = this.http
      .get<Array<{ productId: string; [key: string]: any }>>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((rows) => filterProductRowsForUi(rows) as Array<{ productId: string; [key: string]: any }>),
        shareReplay(1),
        finalize(() => this.productsInFlight.delete(realm))
      );
    this.productsInFlight.set(realm, req);
    return req;
  }
  // ─── Get roles (get role) ────────────────────────────────────────────────
  /**
   * GET /identity/{realm}/products/{productId}/roles
   * Header: Authorization: Bearer {token}
   */
  getRoles(realm: string, productId: string): Observable<any[]> {
    const url = `${this.gw()}/identity/${realm}/products/${productId}/roles`;
    return this.http
      .get<any[]>(url, { headers: this.getAuthHeaders() })
      .pipe(map((rows) => filterRoleRowsForUi(rows) as any[]));
  }
  // ─── Role creation (role creation) ──────────────────────────────────────
  /**
   * POST /identity/{realm}/products/{productId}/roles
   * Body: [{ name, description, url, uri }]
   * Header: Authorization: Bearer {token}
   */
  createRoles(realm: string, productId: string, body: CreateRolesPayload): Observable<any> {
    this.requireToken();
    const url = `${this.gw()}/identity/${realm}/products/${productId}/roles`;
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── Create product (create product) ───────────────────────────────────────
  /**
   * POST /identity/{realm}/products
   * Body: { productId, publicClient, urls }
   * Sends Bearer token when present (some backends require it).
   */
  createProduct(realm: string, body: CreateProductRequest): Observable<any> {
    const url = `${this.gw()}/identity/${realm}/products`;
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }
  /**
   * POST /identity/{realm}/users/{username}/products/{productName}/roles
   * Body: [{ name: "Role1" }]
   * Header: Authorization: Bearer {token}
   */
  assignRoleToUser(
    realm: string,
    username: string,
    productName: string,
    body: AssignRolePayload
  ): Observable<any> {
    this.requireToken();
    const url = `${this.gw()}/identity/${realm}/users/${username}/products/${productName}/roles`;
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── URI check-access ────────────────────────────────────────────────────
  /**
   * GET {baseUrl}/{path} with Bearer token (e.g. GET /service2).
   * Used to test gateway URI access.
   */
  getWithAuth(path: string): Observable<any> {
    this.requireToken();
    const url = path.startsWith('http') ? path : `${this.gw()}/${path.replace(/^\//, '')}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }
  // ─── Validate access (if backend has /identity/validate-access) ───────────
  /**
   * POST /identity/validate-access
   * Body: { accessToken, url }
   */
  validateAccess(accessToken: string, url: string): Observable<any> {
    const endpoint = `${this.gw()}/identity/validate-access`;
    return this.http.post(endpoint, { accessToken, url }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  getRoleUrls(
    realm: string,
    client: string,
    roleName: string
  ): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.gw()}/project/roles/get-urls`,
      {
        realmName: realm,
        productName: client,
        roleName: roleName
      }
    );
  }
}
