import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiGatewayService } from '../services/api-gateway.service';
import { LoginRequest, LoginResponse } from '../models';
import {
  clearStoredRedirectUrl,
  getStoredRealm,
  getStoredRedirectUrl,
  normalizeProductRedirectUrl,
  normalizeRedirectUrl,
  setStoredClientId,
  setStoredRefreshToken,
  setStoredRedirectUrl,
  setStoredRealm,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken,
  touchStoredLastActivity,
  tokenHasAdminRole,
} from '../auth-storage';

/** Pull user-visible text from Spring / gateway JSON error bodies. */
function messageFromHttpError(err: HttpErrorResponse): string {
  const raw = err.error;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as { message?: string };
      if (parsed?.message) return parsed.message;
    } catch {
      return raw.length > 400 ? raw.slice(0, 400) + '…' : raw;
    }
    return raw.length > 400 ? raw.slice(0, 400) + '…' : raw;
  }
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    if (typeof o['message'] === 'string' && o['message'].trim()) return o['message'];
    if (typeof o['error'] === 'string' && o['error'].trim()) return o['error'];
  }
  return err.message || `Login failed (HTTP ${err.status}).`;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginPage implements OnInit {
  realms: string[] = [];
  selectedRealm: string = '';
  selectedClientId: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  token: string = '';
  baseUrl: string = '';
  constructor(
    private apiGateway: ApiGatewayService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private getUserRedirectUrl(): string | null {
    const queryReturnUrl = normalizeRedirectUrl(this.route.snapshot.queryParamMap.get('returnUrl'));
    const storedRedirectUrl = normalizeProductRedirectUrl(getStoredRedirectUrl());
    return this.normalizeLegacyRedirectPath(queryReturnUrl || storedRedirectUrl);
  }

  private getApiRedirectUrl(res: LoginResponse): string | null {
    const rawRedirect = res['redirect_url'];
    if (typeof rawRedirect !== 'string') return null;
    return this.normalizeLegacyRedirectPath(normalizeProductRedirectUrl(rawRedirect));
  }

  private normalizeLegacyRedirectPath(targetUrl: string | null): string | null {
    if (!targetUrl) return null;

    const normalizedUrl = targetUrl.trim();
    if (!normalizedUrl) return null;

    const rewriteDashboardPath = (pathName: string, search: string, hash: string): string => {
      const rewrittenPath = pathName
        .replace('/dashboard/client/products', '/dashboard/product/products')
        .replace('/dashboard/client/users', '/dashboard/product/users')
        .replace('/dashboard/client/roles', '/dashboard/product/roles');

      return `${rewrittenPath}${search}${hash}`;
    };

    if (normalizedUrl.startsWith('/')) {
      const parsed = new URL(normalizedUrl, 'http://local.placeholder');
      return rewriteDashboardPath(parsed.pathname, parsed.search, parsed.hash);
    }

    try {
      const parsed = new URL(normalizedUrl);
      const rewritten = rewriteDashboardPath(parsed.pathname, parsed.search, parsed.hash);
      if (typeof window !== 'undefined' && parsed.origin === window.location.origin) {
        return rewritten;
      }
      return `${parsed.origin}${rewritten}`;
    } catch {
      return normalizedUrl;
    }
  }

  ngOnInit(): void {
    this.selectedRealm = getStoredRealm() || '';
    if (typeof window !== 'undefined') {
      const reason = sessionStorage.getItem('redirect_reason');
      if (reason === 'unauthorized') {
        sessionStorage.removeItem('redirect_reason');
        this.errorMessage = 'Your session expired or you were signed out. Please log in again.';
      } else if (reason === 'idle-timeout') {
        sessionStorage.removeItem('redirect_reason');
        this.errorMessage = 'You were signed out after 10 minutes of inactivity. Please log in again.';
      }
    }
  }
  login(): void {
    this.errorMessage = '';
    if (!this.selectedRealm || !this.username || !this.password || !this.selectedClientId) {
      this.errorMessage = '❌ All fields are required';
      return;
    }
    this.loading = true;
    const body: LoginRequest = {
      username: this.username,
      password: this.password,
      client_id: this.selectedClientId,
    };
    this.apiGateway.login(this.selectedRealm, body).subscribe({
      next: (res: LoginResponse) => {
        console.log('[Login] API Gateway response:', res);
        this.loading = false;
        this.errorMessage = '';
        const token = res.access_token;
        const baseUrl = res.base_url;
        if (token) {
          this.token = token;
          this.baseUrl = baseUrl || '';
          setStoredRealm(this.selectedRealm);
          setStoredClientId(this.selectedClientId);
          setStoredTokenExpiryFromToken(token);
          setStoredTokenExpiryFromExpiresIn(res.expires_in);
          touchStoredLastActivity();
          if (typeof res.refresh_token === 'string' && res.refresh_token.trim()) {
            setStoredRefreshToken(res.refresh_token);
          }

          if (typeof globalThis.window !== 'undefined') {
            if (baseUrl) {
              globalThis.window.localStorage.setItem('base_url', baseUrl);
            }

            // If isAdmin is true, redirect to /dashboard/product
            if (res.isAdmin === true) {
              try {
                this.router.navigateByUrl('/dashboard/product');
              } catch (err) {
                globalThis.window.location.href = '/dashboard/product';
              }
              return;
            }

            // Otherwise, use backend-provided redirect_url
            const apiRedirect = this.getApiRedirectUrl(res);
            if (!apiRedirect) {
              this.errorMessage = 'Login successful, but no redirect URL was provided by the backend.';
              console.warn('[Login] No valid redirect_url provided by backend.');
              return;
            }
            setStoredRedirectUrl(apiRedirect);
            try {
              if (apiRedirect.startsWith('/')) {
                this.router.navigateByUrl(apiRedirect);
              } else {
                globalThis.window.location.href = apiRedirect;
              }
            } catch (redirectErr) {
              console.error('[Login] Redirect failed:', { apiRedirect, redirectErr });
              globalThis.window.location.href = apiRedirect;
            }
          } else {
            setStoredRealm(this.selectedRealm);
          }
        } else {
          this.errorMessage = 'Login successful but no token received';
        }
      },
      error: (err: unknown) => {
        this.loading = false;
        if (err instanceof HttpErrorResponse) {
          console.error('[Login] HTTP error', {
            status: err.status,
            statusText: err.statusText,
            url: err.url,
            body: err.error,
          });
          if (err.status === 0) {
            this.errorMessage =
              'Cannot reach the app/API (network error). Restart Kubernetes port-forwards: run paxo/scripts/start-local-access.sh';
          } else {
            this.errorMessage = messageFromHttpError(err);
          }
        } else {
          console.error('[Login] Error:', err);
          this.errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
        }
      },
    });
  }
}
