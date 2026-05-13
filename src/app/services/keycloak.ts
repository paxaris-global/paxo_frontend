import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  clearAuthState,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken,
} from '../auth-storage';
import { getApiGatewayBaseUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private gw(): string {
    return getApiGatewayBaseUrl();
  }

  constructor(private http: HttpClient) {}

  // ---------- REALMS ----------
  getRealms(): Observable<string[]> {
    return this.http.get<string[]>(`${this.gw()}/identity/realms`);
  }

  // ---------- PRODUCTS ----------
createProductWithFile(
  realm: string,
  product: { productId: string; publicClient: boolean; urls?: string[] },
  backendZip: File,
  frontendZip: File,
  frontendBaseUrl: string
) {
  const token = getStoredToken();

  const formData = new FormData();

  // Important: JSON blob (same as curl)
  formData.append(
    'product',
    new Blob([JSON.stringify(product)], { type: 'application/json' })
  );

  // Multipart parts expected by backend create-product API.
  formData.append('backendZip', backendZip);
  formData.append('frontendZip', frontendZip);
  formData.append('frontendBaseUrl', frontendBaseUrl);

  return this.http.post(
    `${this.gw()}/identity/${realm}/products`,
    formData,
    {
      headers: token
        ? new HttpHeaders({ Authorization: `Bearer ${token}` })
        : undefined,
    }
  );
}

  getProducts(realm?: string): Observable<string[]> {
    const token = getStoredToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    if (realm) {
      // Backend endpoint: GET /identity/products/{realm}
      return this.http.get<any[]>(`${this.gw()}/identity/products/${realm}`, { headers }).pipe(
        map((products: any[]) =>
          products.map((p) => p.clientId || p.productId || p.name || p.id || p)
        )
      );
    }
    // Fallback: try to get from gateway if no realm specified
    return this.http.get<string[]>(`${this.gw()}/gateway/products`, { headers });
  }

  // ---------- LOGIN ----------
  login(realmName: string, username: string, password: string, clientId: string, clientSecret: string): Observable<any> {
    const url = `${this.gw()}/identity/${realmName}/login`;
    const payload = { username, password, client_id: clientId, client_secret: clientSecret || '' };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, payload, { headers }).pipe(
      map((response: any) => {
        // Store token consistently as both 'token' and 'access_token'
        if (response.access_token) {
          setStoredToken(response.access_token);
          setStoredTokenExpiryFromToken(response.access_token);
        }
        if (typeof response.expires_in === 'number') {
          setStoredTokenExpiryFromExpiresIn(response.expires_in);
        }
        if (typeof response.refresh_token === 'string' && response.refresh_token.trim()) {
          setStoredRefreshToken(response.refresh_token);
        }
        return response;
      })
    );
  }

  // ---------- SIGNUP ----------
  
  signup(formData: FormData): Observable<any> {
  const url = `${this.gw()}/identity/signup`;
  // DO NOT set Content-Type for multipart
  return this.http.post(url, formData);
}


  // ---------- USERS ----------
  getUsers(realm: string): Observable<any[]> {
    const token = getStoredToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    return this.http.get<any[]>(`${this.gw()}/identity/users/${realm}`, { headers });
  }

  createUser(realm: string, payload: any): Observable<any> {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const url = `${this.gw()}/identity/${realm}/users`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(url, payload, { headers });
  }

// ---------- UPDATE USER ----------
updateUser(realm: string, username: string, payload: any): Observable<any> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${this.gw()}/identity/users/${realm}/${username}`;
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.put(url, payload, { headers });
}

// ---------- DELETE USER ----------
deleteUser(realm: string, username: string): Observable<any> {
  const token = getStoredToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = `${this.gw()}/identity/users/${realm}/${username}`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.delete(url, { headers });
}

  // ---------- ROLES ----------
  getRoles(realm: string, clientName: string): Observable<any[]> {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const url = `${this.gw()}/identity/${realm}/clients/${clientName}/roles`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(url, { headers });
  }

  createRole(realm: string, clientId: string, payload: any): Observable<any> {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    const url = `${this.gw()}/identity/${realm}/clients/${clientId}/roles`;
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
    // ---------- CREATE ROLE ONLY (KEYCLOAK) ----------
  createRoleOnly(realm: string, productId: string, roleName: string, description: string): Observable<any> {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const payload = [
      {
        name: roleName,
        description: description
      }
    ];

    const url = `${this.gw()}/identity/${realm}/products/${productId}/roles`;
    return this.http.post(url, payload, { headers });
  }


  // ---------- SAVE / UPDATE ROLE URL PERMISSIONS ----------
  saveRoleUrls(
    realm: string,
    clientId: string,
    roleName: string,
    urls: Array<{ url: string; uri: string; httpMethod: string }>
  ): Observable<any> {

    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const payload = {
      realmName: realm,
      productName: clientId,
      roleName: roleName,
      urls: urls,
      token: token
    };

    console.log('Payload sent to save-or-update:', payload);

    return this.http.post(
      `${this.gw()}/project/roles/save-or-update`,
      payload,
      { headers }
    );
  }


  assignRole(realm: string, username: string, productName: string, roleNames: string[]): Observable<any> {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Backend endpoint: POST /identity/{realm}/users/{username}/products/{productName}/roles
    // Payload: List<Map<String, Object>> with role names
    const url = `${this.gw()}/identity/${realm}/users/${username}/products/${productName}/roles`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const payload = roleNames.map(name => ({ name }));
    return this.http.post(url, payload, { headers });
  }

  // ---------- UPLOAD CLIENT ----------
  uploadClient(clientId: string, file: File): Observable<any> {
    const url = `${this.gw()}/gateway/clients/${clientId}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  // ---------- VALIDATE ACCESS ----------
  validateAccess(token: string, url: string): Observable<any> {
    const validateUrl = `${this.gw()}/identity/validate-access`;
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
      requestUrl = `${this.gw()}${url.startsWith('/') ? url : '/' + url}`;
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
    clearAuthState();
    // Replace <realm-name> with your Keycloak realm
    window.location.href = `${this.gw()}/identity/logout`;
  }
}
