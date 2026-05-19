import {
  NavbarComponent,
  init_navbar
} from "./chunk-XVQIYMEK.js";
import {
  ApiGatewayService,
  init_api_gateway_service
} from "./chunk-R5UM7S7V.js";
import {
  Router,
  RouterOutlet,
  init_router,
  provideRouter
} from "./chunk-RUMTJXB2.js";
import {
  CommonModule,
  init_common
} from "./chunk-BUAUFQFR.js";
import "./chunk-WHVCLFVD.js";
import {
  clearAuthState,
  getStoredClientId,
  getStoredLastActivityAt,
  getStoredRealm,
  getStoredRefreshToken,
  getStoredToken,
  getStoredTokenExpiryAt,
  init_auth_storage,
  setStoredRefreshToken,
  setStoredToken,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken,
  touchStoredLastActivity
} from "./chunk-NLLKBMSJ.js";
import "./chunk-IWFMZ7NL.js";
import {
  Component,
  Injectable,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6
} from "./chunk-5VF64QHA.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-V6FC2DIM.js";

// angular:jit:style:inline:src/app/app.ts;CiAgICAKICA=
var app_default;
var init_app = __esm({
  "angular:jit:style:inline:src/app/app.ts;CiAgICAKICA="() {
    app_default = "/* angular:styles/component:css;8062ad595970b5bf5d8f549aecae326caa6a50e13ad6791a7216822752df9856;/Users/m5/paxarisGateway/paxo_frontend/src/app/app.ts */\n/*# sourceMappingURL=app.css.map */\n";
  }
});

// src/app/services/session-manager.service.ts
var SessionManagerService;
var init_session_manager_service = __esm({
  "src/app/services/session-manager.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_router();
    init_auth_storage();
    init_api_gateway_service();
    SessionManagerService = class SessionManagerService2 {
      apiGateway;
      router;
      idleTimeoutMs = 10 * 60 * 1e3;
      refreshBeforeExpiryMs = 60 * 1e3;
      checkIntervalMs = 15 * 1e3;
      activityThrottleMs = 5 * 1e3;
      activityEvents = [
        "click",
        "keydown",
        "mousemove",
        "scroll",
        "touchstart"
      ];
      started = false;
      intervalId = null;
      refreshSub = null;
      lastActivityWriteAt = 0;
      constructor(apiGateway, router) {
        this.apiGateway = apiGateway;
        this.router = router;
      }
      start() {
        if (this.started || typeof window === "undefined")
          return;
        this.started = true;
        this.touchActivity();
        this.activityEvents.forEach((eventName) => {
          window.addEventListener(eventName, this.onActivity, { passive: true });
        });
        this.intervalId = window.setInterval(() => this.tick(), this.checkIntervalMs);
        this.tick();
      }
      ngOnDestroy() {
        this.stop();
      }
      stop() {
        if (typeof window !== "undefined") {
          this.activityEvents.forEach((eventName) => {
            window.removeEventListener(eventName, this.onActivity);
          });
        }
        if (this.intervalId !== null && typeof window !== "undefined") {
          window.clearInterval(this.intervalId);
          this.intervalId = null;
        }
        if (this.refreshSub) {
          this.refreshSub.unsubscribe();
          this.refreshSub = null;
        }
        this.started = false;
      }
      onActivity = () => {
        const now = Date.now();
        if (now - this.lastActivityWriteAt < this.activityThrottleMs)
          return;
        this.lastActivityWriteAt = now;
        this.touchActivity();
      };
      touchActivity() {
        touchStoredLastActivity();
      }
      tick() {
        const token = getStoredToken();
        if (!token)
          return;
        const now = Date.now();
        const lastActivityAt = getStoredLastActivityAt() ?? now;
        if (now - lastActivityAt >= this.idleTimeoutMs) {
          this.forceLogout("idle-timeout");
          return;
        }
        let expiresAt = getStoredTokenExpiryAt();
        if (!expiresAt) {
          setStoredTokenExpiryFromToken(token);
          expiresAt = getStoredTokenExpiryAt();
        }
        if (!expiresAt)
          return;
        const timeLeftMs = expiresAt - now;
        if (timeLeftMs > this.refreshBeforeExpiryMs)
          return;
        if (timeLeftMs <= 0) {
          this.forceLogout("unauthorized");
          return;
        }
        if (this.refreshSub)
          return;
        const realm = getStoredRealm();
        const clientId = getStoredClientId();
        const refreshToken = getStoredRefreshToken();
        if (!realm || !clientId || !refreshToken) {
          return;
        }
        this.refreshSub = this.apiGateway.refreshToken(realm, {
          refresh_token: refreshToken,
          client_id: clientId
        }).subscribe({
          next: (response) => {
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
            this.touchActivity();
            this.clearRefreshSub();
          },
          error: (error) => {
            const status = typeof error?.status === "number" ? error.status : -1;
            if (status === 400 || status === 401) {
              this.forceLogout("unauthorized");
            }
            this.clearRefreshSub();
          }
        });
      }
      clearRefreshSub() {
        if (!this.refreshSub)
          return;
        this.refreshSub.unsubscribe();
        this.refreshSub = null;
      }
      forceLogout(reason) {
        clearAuthState();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("redirect_reason", reason);
        }
        void this.router.navigate(["/login"]);
      }
      static ctorParameters = () => [
        { type: ApiGatewayService },
        { type: Router }
      ];
    };
    SessionManagerService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], SessionManagerService);
  }
});

// src/app/app.ts
var App;
var init_app2 = __esm({
  "src/app/app.ts"() {
    "use strict";
    init_tslib_es6();
    init_app();
    init_core();
    init_router();
    init_navbar();
    init_common();
    init_session_manager_service();
    App = class App2 {
      sessionManager;
      constructor(sessionManager) {
        this.sessionManager = sessionManager;
        this.sessionManager.start();
      }
      static ctorParameters = () => [
        { type: SessionManagerService }
      ];
    };
    App = __decorate([
      Component({
        selector: "app-root",
        standalone: true,
        imports: [CommonModule, NavbarComponent, RouterOutlet],
        template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
        styles: [app_default]
      })
    ], App);
  }
});

// src/app/app.spec.ts
var require_app_spec = __commonJS({
  "src/app/app.spec.ts"(exports) {
    init_testing();
    init_router();
    init_app2();
    init_session_manager_service();
    describe("App", () => {
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [App],
          providers: [
            provideRouter([]),
            {
              provide: SessionManagerService,
              useValue: { start: () => void 0, ngOnDestroy: () => void 0 }
            }
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(App);
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(fixture.componentInstance).toBeTruthy();
      });
    });
  }
});
export default require_app_spec();
//# sourceMappingURL=spec-app-app.spec.js.map
