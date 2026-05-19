import {
  FormsModule,
  init_forms
} from "./chunk-YUDCIBMT.js";
import {
  ApiGatewayService,
  init_api_gateway_service
} from "./chunk-R5UM7S7V.js";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  init_router,
  provideRouter
} from "./chunk-RUMTJXB2.js";
import {
  CommonModule,
  init_common
} from "./chunk-BUAUFQFR.js";
import "./chunk-WHVCLFVD.js";
import {
  HttpErrorResponse,
  getStoredRealm,
  getStoredRedirectUrl,
  init_auth_storage,
  init_http,
  normalizeProductRedirectUrl,
  normalizeRedirectUrl,
  provideHttpClient,
  setStoredClientId,
  setStoredRealm,
  setStoredRedirectUrl,
  setStoredRefreshToken,
  setStoredTokenExpiryFromExpiresIn,
  setStoredTokenExpiryFromToken,
  touchStoredLastActivity
} from "./chunk-NLLKBMSJ.js";
import "./chunk-IWFMZ7NL.js";
import {
  Component,
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

// angular:jit:template:src/app/login/login.html
var login_default;
var init_login = __esm({
  "angular:jit:template:src/app/login/login.html"() {
    login_default = `<div class="login-container">
  <div class="login-header">
    <h2>Welcome Back</h2>
    <p class="subtitle">Sign in to your Paxaris account</p>
  </div>

  <div *ngIf="errorMessage" class="alert alert-error">
    {{ errorMessage }}
  </div>

  <form (ngSubmit)="login()" class="login-form">
    <div class="field">
      <label for="realm">Realm <span class="required">*</span></label>
      <input
        id="realm"
        type="text"
        [(ngModel)]="selectedRealm"
        name="realm"
        placeholder="Enter realm name"
        list="realms-list"
        required
      />
      <datalist id="realms-list">
        <option *ngFor="let realm of realms" [value]="realm"></option>
      </datalist>
    </div>

    <div class="field">
      <label for="client">Client ID <span class="required">*</span></label>
      <input 
        id="client" 
        type="text" 
        [(ngModel)]="selectedClientId" 
        name="clientId"
        [placeholder]="selectedRealm ? (selectedRealm + '-admin-product') : '<realm>-admin-product'"
        required
        [disabled]="loading"
      />
    </div>

    <div class="field">
      <label for="username">Username <span class="required">*</span></label>
      <input 
        id="username" 
        type="text" 
        [(ngModel)]="username" 
        name="username"
        placeholder="Enter your username" 
        required
        [disabled]="loading"
        autocomplete="username"
      />
    </div>

    <div class="field">
      <label for="password">Password <span class="required">*</span></label>
      <input 
        id="password" 
        type="password" 
        [(ngModel)]="password" 
        name="password"
        placeholder="Enter your password" 
        required
        [disabled]="loading"
        autocomplete="current-password"
      />
    </div>

    <button type="submit" [disabled]="loading" class="btn btn-primary btn-lg">
      <span *ngIf="!loading">Sign In</span>
      <span *ngIf="loading" class="spinner"></span>
      <span *ngIf="loading">Signing in...</span>
    </button>
  </form>

  <div class="login-footer">
    <p>Don't have an account? <a routerLink="/signup">Sign up here</a></p>
  </div>

  <!-- Token Info (for debugging - can be hidden in production) -->
  <div *ngIf="token && baseUrl" class="login-info">
    <details>
      <summary>Login Details</summary>
      <div class="info-content">
        <p><strong>Token:</strong> <code>{{ token.substring(0, 50) }}...</code></p>
        <p><strong>Base URL:</strong> <code>{{ baseUrl }}</code></p>
      </div>
    </details>
  </div>
</div>
`;
  }
});

// angular:jit:style:src/app/login/login.css
var login_default2;
var init_login2 = __esm({
  "angular:jit:style:src/app/login/login.css"() {
    login_default2 = '/* src/app/login/login.css */\n.login-container {\n  max-width: 480px;\n  margin: 3rem auto;\n  padding: var(--spacing-2xl);\n  background: var(--bg-primary);\n  border-radius: var(--border-radius-lg);\n  box-shadow: var(--shadow-lg);\n}\n.login-header {\n  text-align: center;\n  margin-bottom: var(--spacing-xl);\n}\n.login-header h2 {\n  margin-bottom: var(--spacing-sm);\n  color: var(--text-primary);\n  font-weight: 700;\n  font-size: var(--font-size-2xl);\n}\n.subtitle {\n  color: var(--text-secondary);\n  font-size: var(--font-size-sm);\n}\n.login-form {\n  margin-bottom: var(--spacing-lg);\n}\n.login-footer {\n  text-align: center;\n  margin-top: var(--spacing-xl);\n  padding-top: var(--spacing-lg);\n  border-top: 1px solid var(--border-color);\n}\n.login-footer p {\n  color: var(--text-secondary);\n  font-size: var(--font-size-sm);\n  margin: 0;\n}\n.login-footer a {\n  color: var(--primary);\n  font-weight: 500;\n}\n.login-info {\n  margin-top: var(--spacing-lg);\n  padding: var(--spacing-md);\n  background: var(--gray-50);\n  border-radius: var(--border-radius);\n  border: 1px solid var(--border-color);\n}\n.login-info summary {\n  cursor: pointer;\n  font-weight: 500;\n  color: var(--text-secondary);\n  font-size: var(--font-size-sm);\n}\n.login-info .info-content {\n  margin-top: var(--spacing-md);\n  padding-top: var(--spacing-md);\n  border-top: 1px solid var(--border-color);\n}\n.login-info .info-content p {\n  margin-bottom: var(--spacing-sm);\n  font-size: var(--font-size-sm);\n  word-break: break-all;\n}\n.login-info .info-content p:last-child {\n  margin-bottom: 0;\n}\n.login-info code {\n  background: var(--gray-100);\n  padding: var(--spacing-xs) var(--spacing-sm);\n  border-radius: var(--border-radius);\n  font-family: "Courier New", monospace;\n  font-size: var(--font-size-xs);\n}\n@media (max-width: 768px) {\n  .login-container {\n    margin: 1rem;\n    padding: var(--spacing-xl);\n  }\n}\n/*# sourceMappingURL=login.css.map */\n';
  }
});

// src/app/login/login.ts
var LoginPage;
var init_login3 = __esm({
  "src/app/login/login.ts"() {
    "use strict";
    init_tslib_es6();
    init_login();
    init_login2();
    init_core();
    init_common();
    init_forms();
    init_router();
    init_http();
    init_api_gateway_service();
    init_auth_storage();
    LoginPage = class LoginPage2 {
      apiGateway;
      router;
      route;
      realms = [];
      selectedRealm = "";
      selectedClientId = "";
      username = "";
      password = "";
      errorMessage = "";
      loading = false;
      token = "";
      baseUrl = "";
      constructor(apiGateway, router, route) {
        this.apiGateway = apiGateway;
        this.router = router;
        this.route = route;
      }
      getUserRedirectUrl() {
        const queryReturnUrl = normalizeRedirectUrl(this.route.snapshot.queryParamMap.get("returnUrl"));
        const storedRedirectUrl = normalizeProductRedirectUrl(getStoredRedirectUrl());
        return this.normalizeLegacyRedirectPath(queryReturnUrl || storedRedirectUrl);
      }
      getApiRedirectUrl(res) {
        const rawRedirect = res["redirect_url"];
        if (typeof rawRedirect !== "string")
          return null;
        return this.normalizeLegacyRedirectPath(normalizeProductRedirectUrl(rawRedirect));
      }
      normalizeLegacyRedirectPath(targetUrl) {
        if (!targetUrl)
          return null;
        const normalizedUrl = targetUrl.trim();
        if (!normalizedUrl)
          return null;
        const rewriteDashboardPath = (pathName, search, hash) => {
          const rewrittenPath = pathName.replace("/dashboard/client/products", "/dashboard/product/products").replace("/dashboard/client/users", "/dashboard/product/users").replace("/dashboard/client/roles", "/dashboard/product/roles");
          return `${rewrittenPath}${search}${hash}`;
        };
        if (normalizedUrl.startsWith("/")) {
          const parsed = new URL(normalizedUrl, "http://local.placeholder");
          return rewriteDashboardPath(parsed.pathname, parsed.search, parsed.hash);
        }
        try {
          const parsed = new URL(normalizedUrl);
          const rewritten = rewriteDashboardPath(parsed.pathname, parsed.search, parsed.hash);
          if (typeof window !== "undefined" && parsed.origin === window.location.origin) {
            return rewritten;
          }
          return `${parsed.origin}${rewritten}`;
        } catch {
          return normalizedUrl;
        }
      }
      ngOnInit() {
        this.selectedRealm = getStoredRealm() || "";
        if (typeof window !== "undefined") {
          const reason = sessionStorage.getItem("redirect_reason");
          if (reason === "unauthorized") {
            sessionStorage.removeItem("redirect_reason");
            this.errorMessage = "Your session expired or you were signed out. Please log in again.";
          } else if (reason === "idle-timeout") {
            sessionStorage.removeItem("redirect_reason");
            this.errorMessage = "You were signed out after 10 minutes of inactivity. Please log in again.";
          }
        }
      }
      login() {
        this.errorMessage = "";
        if (!this.selectedRealm || !this.username || !this.password || !this.selectedClientId) {
          this.errorMessage = "\u274C All fields are required";
          return;
        }
        this.loading = true;
        const body = {
          username: this.username,
          password: this.password,
          client_id: this.selectedClientId
        };
        this.apiGateway.login(this.selectedRealm, body).subscribe({
          next: (res) => {
            console.log("[Login] API Gateway response:", res);
            this.loading = false;
            this.errorMessage = "";
            const token = res.access_token;
            const baseUrl = res.base_url;
            if (token) {
              this.token = token;
              this.baseUrl = baseUrl || "";
              setStoredRealm(this.selectedRealm);
              setStoredClientId(this.selectedClientId);
              setStoredTokenExpiryFromToken(token);
              setStoredTokenExpiryFromExpiresIn(res.expires_in);
              touchStoredLastActivity();
              if (typeof res.refresh_token === "string" && res.refresh_token.trim()) {
                setStoredRefreshToken(res.refresh_token);
              }
              if (typeof globalThis.window !== "undefined") {
                if (baseUrl) {
                  globalThis.window.localStorage.setItem("base_url", baseUrl);
                }
                if (res.isAdmin === true) {
                  try {
                    this.router.navigateByUrl("/dashboard/product");
                  } catch (err) {
                    globalThis.window.location.href = "/dashboard/product";
                  }
                  return;
                }
                const apiRedirect = this.getApiRedirectUrl(res);
                if (!apiRedirect) {
                  this.errorMessage = "Login successful, but no redirect URL was provided by the backend.";
                  console.warn("[Login] No valid redirect_url provided by backend.");
                  return;
                }
                setStoredRedirectUrl(apiRedirect);
                try {
                  if (apiRedirect.startsWith("/")) {
                    this.router.navigateByUrl(apiRedirect);
                  } else {
                    globalThis.window.location.href = apiRedirect;
                  }
                } catch (redirectErr) {
                  console.error("[Login] Redirect failed:", { apiRedirect, redirectErr });
                  globalThis.window.location.href = apiRedirect;
                }
              } else {
                setStoredRealm(this.selectedRealm);
              }
            } else {
              this.errorMessage = "Login successful but no token received";
            }
          },
          error: (err) => {
            console.error("[Login] API Gateway error response:", err);
            this.loading = false;
            if (err instanceof HttpErrorResponse) {
              if (err.status === 0) {
                this.errorMessage = "Cannot reach the app/API (network error). Restart Kubernetes port-forwards: run paxo/scripts/start-local-access.sh";
              } else {
                const body2 = err.error;
                const msgFromBody = typeof body2 === "string" ? body2 : body2?.message || body2?.error;
                this.errorMessage = msgFromBody || err.message || `Login failed (${err.status}${err.statusText ? " " + err.statusText : ""}).`;
              }
            } else {
              this.errorMessage = err instanceof Error ? err.message : "Login failed. Please check your credentials.";
            }
          }
        });
      }
      static ctorParameters = () => [
        { type: ApiGatewayService },
        { type: Router },
        { type: ActivatedRoute }
      ];
    };
    LoginPage = __decorate([
      Component({
        selector: "app-login",
        standalone: true,
        imports: [CommonModule, FormsModule, RouterLink],
        template: login_default,
        styles: [login_default2]
      })
    ], LoginPage);
  }
});

// src/app/login/login.spec.ts
var require_login_spec = __commonJS({
  "src/app/login/login.spec.ts"(exports) {
    init_testing();
    init_http();
    init_router();
    init_login3();
    describe("Login", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [LoginPage],
          providers: [provideHttpClient(), provideRouter([])]
        }).compileComponents();
        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_login_spec();
//# sourceMappingURL=spec-app-login-login.spec.js.map
