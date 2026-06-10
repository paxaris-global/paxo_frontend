import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { filterProductRowsForUi } from '../utils/keycloak-ui-filters.util';
import {
  clearAuthState,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken,
} from '../auth-storage';
import { getApiGatewayBaseUrl } from '../../environments/environment';

export interface ProductProvisionResult {
  status: string;
  realmName?: string;
  productId?: string;
  backendRepository?: string;
  frontendRepository?: string;
  frontendNodePort?: number;
  backendNodePort?: number;
  frontendBaseUrl?: string;
  backendBaseUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private gw(): string {
    return getApiGatewayBaseUrl();
  }

  constructor(private http: HttpClient) {}

  private bearerHeaders(json = false): HttpHeaders | undefined {
    const token = getStoredToken();
    if (!token) {
      return json ? new HttpHeaders({ 'Content-Type': 'application/json' }) : undefined;
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      ...(json ? { 'Content-Type': 'application/json' } : {}),
    });
  }

  private adminUsernameFromToken(): string {
    const token = getStoredToken();
    if (!token) {
      return 'admin';
    }
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(atob(normalized)) as {
        preferred_username?: string;
        username?: string;
      };
      const name = json.preferred_username ?? json.username;
      return typeof name === 'string' && name.trim() ? name.trim() : 'admin';
    } catch {
      return 'admin';
    }
  }

  // ---------- REALMS ----------
  getRealms(): Observable<string[]> {
    return this.http.get<string[]>(`${this.gw()}/identity/realms`);
  }

  // ---------- PRODUCTS ----------
/** Phase 1: create Keycloak client and reserve product URLs. */
createProductInKeycloak(
  realm: string,
  product: { productId: string; publicClient: boolean }
) {
  const token = getStoredToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });
  return this.http.post(
    `${this.gw()}/identity/${realm}/products/keycloak`,
    product,
    { headers }
  );
}

getProductDeploymentStatus(realm: string, productId: string) {
  const token = getStoredToken();
  const headers = new HttpHeaders({
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });
  return this.http.get(
    `${this.gw()}/identity/${realm}/products/${encodeURIComponent(productId)}/deployment-status`,
    { headers }
  );
}

/**
 * Phase 2: GitHub + GitOps via Product Manager (shorter path than /identity/.../deploy).
 * Browser → nginx → gateway → product-management-service (avoids gateway→identity→PM chain).
 */
provisionProductViaProjectManager(
  realm: string,
  productId: string,
  backendZip: File,
  frontendZip: File
): Observable<ProductProvisionResult> {
  const headers = this.bearerHeaders();
  const adminUsername = this.adminUsernameFromToken();
  const provisionBase = `${this.gw()}/project/provision`;

  const repoNameParams = (suffix: string) => ({
    realmName: realm,
    adminUsername,
    productName: `${productId}-${suffix}`,
  });

  return forkJoin({
    backendRepo: this.http.get<{ repositoryName: string }>(
      `${provisionBase}/generate-repo-name`,
      { params: repoNameParams('backend'), headers }
    ),
    frontendRepo: this.http.get<{ repositoryName: string }>(
      `${provisionBase}/generate-repo-name`,
      { params: repoNameParams('frontend'), headers }
    ),
  }).pipe(
    switchMap(({ backendRepo, frontendRepo }) => {
      const formData = new FormData();
      formData.append('realmName', realm);
      formData.append('productId', productId);
      formData.append('backendRepoName', backendRepo.repositoryName);
      formData.append('frontendRepoName', frontendRepo.repositoryName);
      formData.append('backendZip', backendZip, backendZip.name || 'backend.zip');
      formData.append('frontendZip', frontendZip, frontendZip.name || 'frontend.zip');
      return this.http.post<ProductProvisionResult>(`${provisionBase}/product`, formData, {
        headers,
      });
    })
  );
}

/** Legacy identity multipart deploy (prefer {@link provisionProductViaProjectManager}). */
deployProductWithFiles(
  realm: string,
  product: { productId: string; publicClient: boolean; catalogDescription?: string },
  backendZip: File,
  frontendZip: File,
  bannerImage?: File | null
) {
  const formData = new FormData();
  formData.append(
    'product',
    new Blob([JSON.stringify(product)], { type: 'application/json' }),
    'product.json'
  );
  formData.append('backendZip', backendZip, backendZip.name || 'backend.zip');
  formData.append('frontendZip', frontendZip, frontendZip.name || 'frontend.zip');
  if (bannerImage) {
    formData.append('bannerImage', bannerImage, bannerImage.name || 'banner-image');
  }
  return this.http.post(`${this.gw()}/identity/${realm}/products/deploy`, formData, {
    headers: this.bearerHeaders(),
  });
}

/** Keycloak first, then deploy — used by Create Product button. */
createProductWithFile(
  realm: string,
  product: { productId: string; publicClient: boolean; urls?: string[] },
  backendZip: File,
  frontendZip: File,
  bannerImage?: File | null
) {
  return this.createProductInKeycloak(realm, product).pipe(
    switchMap(() =>
      this.deployProductWithFiles(realm, product, backendZip, frontendZip, bannerImage)
    )
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
        map((products: any[]) => {
          const ids = filterProductRowsForUi(products || []).map((p) => {
            const row = p as { clientId?: string; productId?: string; name?: string; id?: string };
            return String(row.clientId || row.productId || row.name || row.id || '').trim();
          });
          return ids.filter((id) => id.length > 0);
        })
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
    return this.http.post(url, payload, { headers, responseType: 'text' });
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
    // Backend returns plain text ("Roles created successfully..."), not JSON.
    return this.http.post(url, payload, { headers, responseType: 'text' });
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
    return this.http.post(url, payload, { headers, responseType: 'text' });
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
