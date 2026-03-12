﻿import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiGatewayService } from '../services/api-gateway.service';
import { LoginRequest, LoginResponse } from '../models';
import {
  clearStoredRedirectUrl,
  getStoredRealm,
  getStoredRedirectUrl,
  normalizeProductRedirectUrl,
  normalizeRedirectUrl,
  setStoredRedirectUrl,
  setStoredRealm,
  tokenHasAdminRole,
} from '../auth-storage';
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
    return queryReturnUrl || storedRedirectUrl;
  }

  private getApiRedirectUrl(res: LoginResponse): string | null {
    const rawRedirect = res['redirect_url'];
    if (typeof rawRedirect !== 'string') return null;
    const trimmed = rawRedirect.trim();
    return trimmed || null;
  }

  ngOnInit(): void {
    this.selectedRealm = getStoredRealm() || '';
    if (typeof window !== 'undefined') {
      const reason = sessionStorage.getItem('redirect_reason');
      if (reason === 'unauthorized') {
        sessionStorage.removeItem('redirect_reason');
        this.errorMessage = 'Your session expired or you were signed out. Please log in again.';
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
          const isAdmin = tokenHasAdminRole(token);

          if (typeof window !== 'undefined') {
            if (baseUrl) {
              window.localStorage.setItem('base_url', baseUrl);
            }

            const adminRedirect = `/dashboard/product/users?realm=${encodeURIComponent(this.selectedRealm)}`;
            const apiRedirect = this.getApiRedirectUrl(res);
            const userRedirect = apiRedirect || this.getUserRedirectUrl();
            const targetUrl = isAdmin ? adminRedirect : userRedirect;

            console.log('[Login] redirect decision:', {
              isAdmin,
              apiRedirect,
              fallbackRedirect: this.getUserRedirectUrl(),
              targetUrl,
            });

            if (!targetUrl) {
              this.errorMessage = 'Login successful, but no redirect URL is available for this user.';
              console.warn('[Login] No valid redirect target found for non-admin user.');
              return;
            }

            setStoredRealm(this.selectedRealm);

            if (isAdmin) {
              clearStoredRedirectUrl();
            } else if (userRedirect) {
              // Keep redirect_url visible in localStorage for debugging and reuse.
              setStoredRedirectUrl(userRedirect);
            }

            if (isAdmin) {
              this.router.navigateByUrl(targetUrl);
            } else {
              // For non-admin users, redirect exactly to backend-provided URL.
              try {
                window.location.href = targetUrl;
              } catch (redirectErr) {
                console.error('[Login] Redirect failed:', { targetUrl, redirectErr });
                this.errorMessage = `Login successful, but browser rejected redirect_url: ${targetUrl}`;
              }
            }
          } else {
            setStoredRealm(this.selectedRealm);
          }
        } else {
          this.errorMessage = 'Login successful but no token received';
        }
      },
      error: (err: any) => {
        console.error('[Login] API Gateway error response:', err);
        this.loading = false;
        this.errorMessage = err.error?.message || err.error?.error || err.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      },
    });
  }
}
