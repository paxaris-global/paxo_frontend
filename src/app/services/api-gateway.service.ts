import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, finalize } from 'rxjs/operators';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  UserCreationRequest,
  CreateClientRequest,
  CreateRolesPayload,
  AssignRolePayload,
} from '../models';
import { getStoredToken, setStoredToken } from '../auth-storage';
/**
 * API Gateway Service – mirrors Postman collection "api gateway".
 * Uses relative URLs so /identity and /gateway are proxied to localhost:8085
 * (see proxy.conf.json). Backend stays on localhost only (not on ngrok).
 * When the app is served via ngrok, API calls go same-origin → dev server
 * proxies to localhost:8085. No backend deployment on ngrok needed.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiGatewayService {
  private readonly baseUrl = 'http://localhost:8085';
  private usersInFlight = new Map<string, Observable<any[]>>();
  private clientsInFlight = new Map<string, Observable<Array<{ clientId: string; [key: string]: any }>>>();
  constructor(private http: HttpClient) {}
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
    return this.http.get(`${this.baseUrl}/identity/realms/user`, {
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
    const url = `${this.baseUrl}/identity/${realm}/login`;
    return this.http.post<LoginResponse>(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      map((res) => {
        if (res.access_token) {
          setStoredToken(res.access_token);
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
    const url = `${this.baseUrl}/identity/signup`;
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
    const url = `${this.baseUrl}/identity/signup`;
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
    const url = `${this.baseUrl}/identity/users/${realm}`;
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
    const url = `${this.baseUrl}/identity/${realm}/users`;
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
    const url = `${this.baseUrl}/identity/users/${realm}/${username}`;
    return this.http.put(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── Get roles (get role) ────────────────────────────────────────────────
  /**
   * GET /identity/{realm}/clients/{clientId}/roles
   * Header: Authorization: Bearer {token}
   */
  getRoles(realm: string, clientId: string): Observable<any[]> {
    const url = `${this.baseUrl}/identity/${realm}/clients/${clientId}/roles`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() });
  }
  // ─── Role creation (role creation) ──────────────────────────────────────
  /**
   * POST /identity/{realm}/clients/{clientId}/roles
   * Body: [{ name, description, url, uri }]
   * Header: Authorization: Bearer {token}
   */
  createRoles(realm: string, clientId: string, body: CreateRolesPayload): Observable<any> {
    this.requireToken();
    const url = `${this.baseUrl}/identity/${realm}/clients/${clientId}/roles`;
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── Get clients (list clients for realm) ─────────────────────────────────
  /**
   * GET /identity/clients/{realm}
   * Returns array of client objects; use clientId for dropdown values.
   * Deduplicated: repeated calls for the same realm while in flight share one HTTP request.
   */
  getClients(realm: string): Observable<Array<{ clientId: string; [key: string]: any }>> {
    const existing = this.clientsInFlight.get(realm);
    if (existing) return existing;
    const url = `${this.baseUrl}/identity/clients/${realm}`;
    const req = this.http
      .get<Array<{ clientId: string; [key: string]: any }>>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        shareReplay(1),
        finalize(() => this.clientsInFlight.delete(realm))
      );
    this.clientsInFlight.set(realm, req);
    return req;
  }
  // ─── Create client (create client) ───────────────────────────────────────
  /**
   * POST /identity/{realm}/clients
   * Body: { clientId, publicClient, urls }
   * Sends Bearer token when present (some backends require it).
   */
  createClient(realm: string, body: CreateClientRequest): Observable<any> {
    const url = `${this.baseUrl}/identity/${realm}/clients`;
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── Assign role to user (assign role to user) ───────────────────────────
  /**
   * POST /identity/{realm}/users/{username}/clients/{clientName}/roles
   * Body: [{ name: "Role1" }]
   * Header: Authorization: Bearer {token}
   */
  assignRoleToUser(
    realm: string,
    username: string,
    clientName: string,
    body: AssignRolePayload
  ): Observable<any> {
    this.requireToken();
    const url = `${this.baseUrl}/identity/${realm}/users/${username}/clients/${clientName}/roles`;
    return this.http.post(url, body, { headers: this.getAuthHeaders() });
  }
  // ─── URI check-access ────────────────────────────────────────────────────
  /**
   * GET {baseUrl}/{path} with Bearer token (e.g. GET /service2).
   * Used to test gateway URI access.
   */
  getWithAuth(path: string): Observable<any> {
    this.requireToken();
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path.replace(/^\//, '')}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }
  // ─── Validate access (if backend has /identity/validate-access) ───────────
  /**
   * POST /identity/validate-access
   * Body: { accessToken, url }
   */
  validateAccess(accessToken: string, url: string): Observable<any> {
    const endpoint = `${this.baseUrl}/identity/validate-access`;
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
      `${this.baseUrl}/project/roles/get-urls`,
      {
        realmName: realm,
        productName: client,
        roleName: roleName
      }
    );
  }
}
