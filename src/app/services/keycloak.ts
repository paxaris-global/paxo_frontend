import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    if (realm) {
      return this.http.get<string[]>(`${this.baseUrl}/identity/${realm}/clients`);
    }
    return this.http.get<string[]>(`${this.baseUrl}/gateway/clients`);
  }

  // ---------- LOGIN ----------
  login(realmName: string, username: string, password: string, clientId: string, clientSecret: string): Observable<any> {
    const url = `${this.baseUrl}/identity/${realmName}/login`;
    const payload = { username, password, client_id: clientId, client_secret: clientSecret };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, payload, { headers });
  }

  // ---------- SIGNUP ----------
  
  signup(formData: FormData): Observable<any> {
  const url = `${this.baseUrl}/identity/signup`;
  // DO NOT set Content-Type for multipart
  return this.http.post(url, formData);
}


  // ---------- USERS ----------
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/identity/users`);
  }

  createUser(payload: any): Observable<any> {
    const url = `${this.baseUrl}/identity/users`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, payload, { headers });
  }

  // ---------- ROLES ----------
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gateway/roles`);
  }

  createRole(clientId: string, payload: any): Observable<any> {
    const url = `${this.baseUrl}/gateway/roles/${clientId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, payload, { headers });
  }

  assignRole(userId: string, clientId: string, roleName: string): Observable<any> {
    const url = `${this.baseUrl}/gateway/assign-role`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, { userId, clientId, roleName }, { headers });
  }

  // ---------- UPLOAD CLIENT ----------
  uploadClient(clientId: string, file: File): Observable<any> {
    const url = `${this.baseUrl}/gateway/clients/${clientId}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  // ---------- LOGOUT ----------
  logout(): void {
    // Replace <realm-name> with your Keycloak realm
    window.location.href = `${this.baseUrl}/identity/logout`;
  }
}
