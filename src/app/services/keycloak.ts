import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private baseUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) {}

  // ---------- REALMS ----------
  getRealms(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/identity/realms`);
  }

  // ---------- CLIENTS ----------
  getClients(realm?: string): Observable<string[]> {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    if (realm) {
      // Backend endpoint: GET /identity/clients/{realm}
      return this.http.get<any[]>(`${this.baseUrl}/identity/clients/${realm}`, { headers }).pipe(
        map((clients: any[]) => clients.map(c => c.clientId || c.id || c.name || c))
      );
    }
    // Fallback: try to get from gateway if no realm specified
    return this.http.get<string[]>(`${this.baseUrl}/gateway/clients`, { headers });
  }

  // ---------- LOGIN ----------
  login(realmName: string, username: string, password: string, clientId: string, clientSecret: string): Observable<any> {
    const url = `${this.baseUrl}/identity/${realmName}/login`;
    const payload = { username, password, client_id: clientId, client_secret: clientSecret || '' };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, payload, { headers }).pipe(
      map((response: any) => {
        // Store token consistently as both 'token' and 'access_token'
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('access_token', response.access_token);
        }
        return response;
      })
    );
  }

  // ---------- SIGNUP ----------
  
  signup(formData: FormData): Observable<any> {
  const url = `${this.baseUrl}/identity/signup`;
  // DO NOT set Content-Type for multipart
  return this.http.post(url, formData);
}


  // ---------- USERS ----------
  getUsers(realm: string): Observable<any[]> {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    return this.http.get<any[]>(`${this.baseUrl}/identity/users/${realm}`, { headers });
  }

  createUser(realm: string, payload: any): Observable<any> {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const url = `${this.baseUrl}/identity/${realm}/users`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(url, payload, { headers });
  }

  // ---------- ROLES ----------
  getRoles(realm: string, clientName: string): Observable<any[]> {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const url = `${this.baseUrl}/identity/${realm}/clients/${clientName}/roles`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(url, { headers });
  }

  createRole(realm: string, clientId: string, payload: any): Observable<any> {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const url = `${this.baseUrl}/identity/${realm}/clients/${clientId}/roles`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(url, payload, { headers });
  }

  /**
   * Create role with multiple URL/URI pairs
   * This method creates the role in Keycloak and then saves URL mappings to Project Manager
   */
  createRoleWithUrls(
    realm: string,
    clientId: string,
    roleName: string,
    description: string,
    urlUriPairs: Array<{ url: string; uri: string }>
  ): Observable<any> {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Step 1: Create role in Keycloak via Identity Service
    // Send array of RoleCreationRequest (backend expects List<RoleCreationRequest>)
    const createRolePayload = [{
      name: roleName,
      description: description,
      url: urlUriPairs[0]?.url || '', // First URL for backward compatibility
      uri: urlUriPairs[0]?.uri || '' // First URI for backward compatibility
    }];

    const createRoleUrl = `${this.baseUrl}/identity/${realm}/clients/${clientId}/roles`;
    
    // Create role first in Keycloak
    return this.http.post(createRoleUrl, createRolePayload, { headers }).pipe(
      // After role is created, save all URL/URI pairs to Project Manager
      switchMap(() => {
        // Step 2: Save all URL/URI pairs to Project Manager
        // The backend endpoint expects: POST /project/roles/save-or-update
        // Payload: { realmName, productName, roleName, urls: [{url, uri}, ...] }
        const projectManagerPayload = {
          realmName: realm,
          productName: clientId,
          roleName: roleName,
          urls: urlUriPairs.map(pair => ({
            url: pair.url,
            uri: pair.uri
          }))
        };

        // Use /product/roles/save-or-update (gateway routes /product/** to Project Manager)
        // OR use direct path if gateway has catch-all route
        // Project Manager endpoint through gateway
        // Gateway has catch-all route /** that routes to Project Manager
        // Project Manager endpoint: POST /project/roles/save-or-update
        // Payload: { realmName, productName, roleName, urls: [{url, uri}, ...] }
        const projectManagerUrl = `${this.baseUrl}/project/roles/save-or-update`;
        return this.http.post(projectManagerUrl, projectManagerPayload, { headers });
      })
    );
  }

  assignRole(realm: string, username: string, clientName: string, roleName: string): Observable<any> {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Backend endpoint: POST /identity/{realm}/users/{username}/clients/{clientName}/roles
    // Payload: List<Map<String, Object>> with role names
    const url = `${this.baseUrl}/identity/${realm}/users/${username}/clients/${clientName}/roles`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const payload = [{ name: roleName }];
    return this.http.post(url, payload, { headers });
  }

  // ---------- UPLOAD CLIENT ----------
  uploadClient(clientId: string, file: File): Observable<any> {
    const url = `${this.baseUrl}/gateway/clients/${clientId}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  // ---------- VALIDATE ACCESS ----------
  validateAccess(token: string, url: string): Observable<any> {
    const validateUrl = `${this.baseUrl}/identity/validate-access`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const payload = {
      accessToken: token,
      url: url
    };
    return this.http.post(validateUrl, payload, { headers });
  }

  // ---------- MAKE ACTUAL HTTP REQUEST (for testing) ----------
  makeHttpRequest(token: string, url: string, method: string): Observable<any> {
    // Ensure URL starts with / if it's a relative path
    let requestUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Relative path - prepend gateway base URL
      requestUrl = `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {})
    });

    switch (method) {
      case 'GET':
        return this.http.get(requestUrl, { headers, observe: 'response' }).pipe(
          map(response => ({ data: response.body, statusCode: response.status }))
        );
      case 'POST':
        return this.http.post(requestUrl, {}, { headers, observe: 'response' }).pipe(
          map(response => ({ data: response.body, statusCode: response.status }))
        );
      case 'PUT':
        return this.http.put(requestUrl, {}, { headers, observe: 'response' }).pipe(
          map(response => ({ data: response.body, statusCode: response.status }))
        );
      case 'DELETE':
        return this.http.delete(requestUrl, { headers, observe: 'response' }).pipe(
          map(response => ({ data: response.body, statusCode: response.status }))
        );
      case 'PATCH':
        return this.http.patch(requestUrl, {}, { headers, observe: 'response' }).pipe(
          map(response => ({ data: response.body, statusCode: response.status }))
        );
      default:
        return this.http.get(requestUrl, { headers, observe: 'response' }).pipe(
          map(response => ({ data: response.body, statusCode: response.status }))
        );
    }
  }

  // ---------- LOGOUT ----------
  logout(): void {
    // Replace <realm-name> with your Keycloak realm
    window.location.href = `${this.baseUrl}/identity/logout`;
  }
}
