import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  clearAuthState,
  getStoredClientId,
  getStoredLastActivityAt,
  getStoredRealm,
  getStoredRefreshToken,
  getStoredToken,
  getStoredTokenExpiryAt,
  setStoredRefreshToken,
  setStoredToken,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken,
  touchStoredLastActivity,
} from '../auth-storage';
import { ApiGatewayService } from './api-gateway.service';

@Injectable({
  providedIn: 'root',
})
export class SessionManagerService implements OnDestroy {
  private readonly idleTimeoutMs = 10 * 60 * 1000;
  private readonly refreshBeforeExpiryMs = 60 * 1000;
  private readonly checkIntervalMs = 15 * 1000;
  private readonly activityThrottleMs = 5 * 1000;
  private readonly activityEvents: Array<keyof WindowEventMap> = [
    'click',
    'keydown',
    'mousemove',
    'scroll',
    'touchstart',
  ];

  private started = false;
  private intervalId: number | null = null;
  private refreshSub: Subscription | null = null;
  private lastActivityWriteAt = 0;

  constructor(
    private readonly apiGateway: ApiGatewayService,
    private readonly router: Router
  ) {}

  start(): void {
    if (this.started || typeof window === 'undefined') return;

    this.started = true;
    this.touchActivity();

    this.activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, this.onActivity, { passive: true });
    });

    this.intervalId = window.setInterval(() => this.tick(), this.checkIntervalMs);
    this.tick();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  stop(): void {
    if (typeof window !== 'undefined') {
      this.activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, this.onActivity);
      });
    }

    if (this.intervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
      this.refreshSub = null;
    }

    this.started = false;
  }

  private readonly onActivity = (): void => {
    const now = Date.now();
    if (now - this.lastActivityWriteAt < this.activityThrottleMs) return;

    this.lastActivityWriteAt = now;
    this.touchActivity();
  };

  private touchActivity(): void {
    touchStoredLastActivity();
  }

  private tick(): void {
    const token = getStoredToken();
    if (!token) return;

    const now = Date.now();
    const lastActivityAt = getStoredLastActivityAt() ?? now;

    if (now - lastActivityAt >= this.idleTimeoutMs) {
      this.forceLogout('idle-timeout');
      return;
    }

    let expiresAt = getStoredTokenExpiryAt();
    if (!expiresAt) {
      setStoredTokenExpiryFromToken(token);
      expiresAt = getStoredTokenExpiryAt();
    }

    if (!expiresAt) return;

    const timeLeftMs = expiresAt - now;
    if (timeLeftMs > this.refreshBeforeExpiryMs) return;

    if (timeLeftMs <= 0) {
      this.forceLogout('unauthorized');
      return;
    }

    if (this.refreshSub) return;

    const realm = getStoredRealm();
    const clientId = getStoredClientId();
    const refreshToken = getStoredRefreshToken();

    if (!realm || !clientId || !refreshToken) {
      return;
    }

    this.refreshSub = this.apiGateway
      .refreshToken(realm, {
        refresh_token: refreshToken,
        client_id: clientId,
      })
      .subscribe({
        next: (response) => {
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
          this.touchActivity();
          this.clearRefreshSub();
        },
        error: (error: { status?: number }) => {
          const status = typeof error?.status === 'number' ? error.status : -1;
          if (status === 400 || status === 401) {
            this.forceLogout('unauthorized');
          }
          this.clearRefreshSub();
        },
      });
  }

  private clearRefreshSub(): void {
    if (!this.refreshSub) return;
    this.refreshSub.unsubscribe();
    this.refreshSub = null;
  }

  private forceLogout(reason: 'idle-timeout' | 'unauthorized'): void {
    clearAuthState();

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirect_reason', reason);
    }

    void this.router.navigate(['/'], { replaceUrl: true });
  }
}
