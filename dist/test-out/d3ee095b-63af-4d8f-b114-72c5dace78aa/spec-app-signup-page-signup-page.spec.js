import {
  ApiGatewayService,
  init_api_gateway_service
} from "./chunk-EBRDM2MT.js";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  init_forms
} from "./chunk-CCNVDURJ.js";
import {
  Router,
  init_router
} from "./chunk-CAH3UFKY.js";
import "./chunk-TXZUCGYE.js";
import {
  CommonModule,
  init_common
} from "./chunk-C3KVU4UK.js";
import "./chunk-OKQC65K7.js";
import {
  HttpErrorResponse,
  getStoredRealm,
  init_auth_storage,
  init_http
} from "./chunk-2RYQMDFA.js";
import "./chunk-KK3UVDLS.js";
import {
  Component,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6
} from "./chunk-G6FXXSSP.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-TTULUY32.js";

// angular:jit:template:src/app/signup-page/signup-page.html
var signup_page_default;
var init_signup_page = __esm({
  "angular:jit:template:src/app/signup-page/signup-page.html"() {
    signup_page_default = `<div class="signup-wrapper">
  <div class="signup-card">
    <h2>\u{1F9E9} Create New Realm</h2>
    <p class="subtitle">Provision a new Keycloak Realm & Admin User</p>

    <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">

      <!-- Realm Section -->
      <div class="section">
        <h3>\u{1F310} Realm Details</h3>

        <div class="field">
          <label>Realm Name</label>
          <input type="text" formControlName="realmName" placeholder="e.g. myRealmVip"  />
        </div>

        <div class="field">
          <label>Admin Password</label>
          <input type="password" formControlName="adminPassword" placeholder="Set admin password" />
        </div>
      </div>
      

      <button type="submit" [disabled]="signupForm.invalid || loading">
        {{ loading ? 'Processing...' : 'Sign Up' }}
      </button>
    </form>

    <div *ngIf="message" class="message">{{ message }}</div>
  </div>
</div>
`;
  }
});

// angular:jit:style:src/app/signup-page/signup-page.css
var signup_page_default2;
var init_signup_page2 = __esm({
  "angular:jit:style:src/app/signup-page/signup-page.css"() {
    signup_page_default2 = "/* src/app/signup-page/signup-page.css */\n.signup-wrapper {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: calc(100vh - 70px);\n  padding: var(--spacing-xl);\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n}\n.signup-card {\n  background: var(--bg-primary);\n  border-radius: var(--border-radius-lg);\n  box-shadow: var(--shadow-lg);\n  padding: var(--spacing-2xl);\n  max-width: 700px;\n  width: 100%;\n  animation: fadeIn 0.4s ease-in-out;\n}\n.signup-card h2 {\n  text-align: center;\n  margin-bottom: var(--spacing-sm);\n  color: var(--text-primary);\n  font-size: var(--font-size-2xl);\n}\n.subtitle {\n  text-align: center;\n  color: var(--text-secondary);\n  font-size: var(--font-size-sm);\n  margin-bottom: var(--spacing-xl);\n}\n.section {\n  background: var(--gray-50);\n  padding: var(--spacing-lg);\n  border-radius: var(--border-radius);\n  margin-bottom: var(--spacing-lg);\n  border-left: 4px solid var(--primary);\n  transition: var(--transition);\n}\n.section:hover {\n  box-shadow: var(--shadow-sm);\n}\n.section h3 {\n  color: var(--primary);\n  margin-bottom: var(--spacing-md);\n  font-size: var(--font-size-lg);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n.field {\n  margin-bottom: var(--spacing-md);\n}\n.field label {\n  font-weight: 500;\n  display: block;\n  color: var(--text-primary);\n  margin-bottom: var(--spacing-xs);\n  font-size: var(--font-size-sm);\n}\ninput[type=text],\ninput[type=email],\ninput[type=password],\ninput[type=file] {\n  width: 100%;\n  padding: var(--spacing-md);\n  border-radius: var(--border-radius);\n  border: 1px solid var(--border-color);\n  background: var(--bg-primary);\n  font-size: var(--font-size-base);\n  transition: var(--transition);\n}\ninput:focus {\n  outline: none;\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\nselect {\n  width: 100%;\n  padding: var(--spacing-md);\n  border-radius: var(--border-radius);\n  border: 1px solid var(--border-color);\n  background: var(--bg-primary);\n  font-size: var(--font-size-base);\n  transition: var(--transition);\n}\nselect:focus {\n  outline: none;\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\ninput:disabled {\n  background-color: var(--gray-100);\n  cursor: not-allowed;\n}\n.checkbox {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n  font-weight: 500;\n  margin-top: var(--spacing-sm);\n}\nbutton {\n  width: 100%;\n  margin-top: var(--spacing-lg);\n  padding: var(--spacing-md) var(--spacing-xl);\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary) 0%,\n      var(--primary-dark) 100%);\n  border: none;\n  color: var(--text-white);\n  font-size: var(--font-size-base);\n  font-weight: 600;\n  border-radius: var(--border-radius);\n  cursor: pointer;\n  transition: var(--transition);\n}\nbutton:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: var(--shadow-md);\n}\nbutton:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.message {\n  margin-top: var(--spacing-lg);\n  padding: var(--spacing-md);\n  text-align: center;\n  font-weight: 600;\n  border-radius: var(--border-radius);\n}\n.message.success {\n  background-color: #d1fae5;\n  color: #065f46;\n  border: 1px solid var(--success);\n}\n.message.error {\n  background-color: #fee2e2;\n  color: #991b1b;\n  border: 1px solid var(--error);\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .signup-wrapper {\n    padding: var(--spacing-md);\n  }\n  .signup-card {\n    padding: var(--spacing-lg);\n  }\n  .signup-card h2 {\n    font-size: var(--font-size-xl);\n  }\n}\n/*# sourceMappingURL=signup-page.css.map */\n";
  }
});

// src/app/signup-page/signup-page.ts
var SignupPage;
var init_signup_page3 = __esm({
  "src/app/signup-page/signup-page.ts"() {
    "use strict";
    init_tslib_es6();
    init_signup_page();
    init_signup_page2();
    init_core();
    init_common();
    init_forms();
    init_router();
    init_http();
    init_api_gateway_service();
    init_auth_storage();
    SignupPage = class SignupPage2 {
      fb;
      apiGateway;
      router;
      signupForm;
      message = "";
      loading = false;
      constructor(fb, apiGateway, router) {
        this.fb = fb;
        this.apiGateway = apiGateway;
        this.router = router;
      }
      ngOnInit() {
        this.signupForm = this.fb.group({
          realmName: [{ value: getStoredRealm() || "", disabled: false }, Validators.required],
          adminPassword: ["", [Validators.required, Validators.minLength(4)]]
        });
      }
      onSubmit() {
        if (this.signupForm.invalid) {
          this.message = "\u26A0\uFE0F Please fill all fields.";
          return;
        }
        this.loading = true;
        const v = this.signupForm.getRawValue();
        const payload = {
          realmName: v.realmName,
          adminPassword: v.adminPassword
        };
        this.apiGateway.signup(payload).subscribe({
          next: (res) => {
            this.loading = false;
            if (res.status === "SUCCESS") {
              this.message = "\u2705 " + res.message;
              this.router.navigate(["/dashboard"], {
                queryParams: { realm: payload.realmName }
              });
            } else {
              this.message = "\u274C " + res.message;
            }
          },
          error: (err) => {
            this.loading = false;
            if (err instanceof HttpErrorResponse && err.status === 0) {
              this.message = "\u274C Cannot reach the API. Run paxo/scripts/start-local-access.sh (port-forward), then try again.";
            } else if (err instanceof HttpErrorResponse) {
              const body = err.error;
              this.message = "\u274C " + (body?.message || err.message);
            } else {
              this.message = "\u274C " + (err instanceof Error ? err.message : "Signup failed.");
            }
          }
        });
      }
      static ctorParameters = () => [
        { type: FormBuilder },
        { type: ApiGatewayService },
        { type: Router }
      ];
    };
    SignupPage = __decorate([
      Component({
        selector: "app-signup-page",
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule],
        template: signup_page_default,
        styles: [signup_page_default2]
      })
    ], SignupPage);
  }
});

// src/app/signup-page/signup-page.spec.ts
var require_signup_page_spec = __commonJS({
  "src/app/signup-page/signup-page.spec.ts"(exports) {
    init_testing();
    init_signup_page3();
    describe("SignupPage", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [SignupPage]
        }).compileComponents();
        fixture = TestBed.createComponent(SignupPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_signup_page_spec();
//# sourceMappingURL=spec-app-signup-page-signup-page.spec.js.map
