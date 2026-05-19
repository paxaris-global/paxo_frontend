import {
  ApiGatewayService,
  init_api_gateway_service
} from "./chunk-EBRDM2MT.js";
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  init_router
} from "./chunk-CAH3UFKY.js";
import "./chunk-TXZUCGYE.js";
import {
  CommonModule,
  init_common
} from "./chunk-C3KVU4UK.js";
import "./chunk-OKQC65K7.js";
import {
  getStoredRealm,
  init_auth_storage,
  setStoredRealm
} from "./chunk-2RYQMDFA.js";
import "./chunk-KK3UVDLS.js";
import {
  Component,
  Injectable,
  Subject,
  TestBed,
  __decorate,
  init_core,
  init_esm,
  init_operators,
  init_testing,
  init_tslib_es6,
  of,
  takeUntil
} from "./chunk-G6FXXSSP.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-TTULUY32.js";

// angular:jit:template:src/app/dashboard/dashboard.html
var dashboard_default;
var init_dashboard = __esm({
  "angular:jit:template:src/app/dashboard/dashboard.html"() {
    dashboard_default = `<div class="dashboard">

  <!-- Sidebar -->
  <aside class="sidebar">
    <h2>\u2699\uFE0F Admin</h2>

    <!-- <div class="sidebar-group"> -->
      <nav class="sidebar-children">
        <!-- <a [routerLink]="['product', 'products']" [queryParams]="{ realm: realmName }" routerLinkActive="active" class="sidebar-child">\u{1F4E6} Products</a> -->
        <div class="sidebar-subgroup">
          <button type="button" class="sidebar-subgroup-toggle" (click)="usersAndRolesMenuOpen = !usersAndRolesMenuOpen" [attr.aria-expanded]="usersAndRolesMenuOpen">
            <span>\u{1F465} Users and Role</span>
            <span class="sidebar-chevron" [class.open]="usersAndRolesMenuOpen">\u25BC</span>
          </button>
         <nav class="sidebar-subchildren" [class.open]="usersAndRolesMenuOpen">
  <a [routerLink]="['/dashboard', 'product', 'users']" [queryParams]="{ realm: realmName, section: 'users' }" routerLinkActive="active" class="sidebar-child">Users</a>
  <a [routerLink]="['/dashboard', 'product', 'roles']" [queryParams]="{ realm: realmName, section: 'roles' }" routerLinkActive="active" class="sidebar-child">Roles</a>
  <a [routerLink]="['/dashboard', 'product', 'roleUrl']" [queryParams]="{ realm: realmName, section: 'roleUrl' }" routerLinkActive="active" class="sidebar-child">Assign URIs to Role</a>
  <a [routerLink]="['/dashboard', 'product', 'products']" [queryParams]="{ realm: realmName }" routerLinkActive="active" class="sidebar-child">Create Product</a>
  <a [routerLink]="['/dashboard', 'product', 'assign-roles']" [queryParams]="{ realm: realmName, section: 'assign' }" routerLinkActive="active" class="sidebar-child">Assign Roles</a>
</nav>

        </div>
      </nav>
    <!-- </div> -->

    <!-- <a [routerLink]="['settings']" [queryParams]="{ realm: realmName }" routerLinkActive="active">\u2699\uFE0F Settings</a> -->
  </aside>

  <!-- Content -->
  <main class="content">
    <header>
      <h1>Realm: <span>{{ realmName }}</span></h1>
      <p *ngIf="!loadingProducts && realmName !== 'Unknown Realm'" class="realm-summary">
        {{ products.length }} product(s) in this realm
      </p>
      <p *ngIf="loadingProducts" class="realm-summary">Loading\u2026</p>
    </header>

    <!-- SPA content loads here -->
    <router-outlet></router-outlet>
  </main>

</div>
`;
  }
});

// angular:jit:style:src/app/dashboard/dashboard.css
var dashboard_default2;
var init_dashboard2 = __esm({
  "angular:jit:style:src/app/dashboard/dashboard.css"() {
    dashboard_default2 = "/* src/app/dashboard/dashboard.css */\n.dashboard {\n  display: flex;\n  min-height: calc(100vh - 70px);\n  background: var(--bg-secondary);\n}\n.sidebar {\n  width: 260px;\n  background: var(--bg-dark);\n  color: var(--text-white);\n  padding: var(--spacing-xl);\n  display: flex;\n  flex-direction: column;\n  box-shadow: var(--shadow-md);\n  position: sticky;\n  top: 70px;\n  height: calc(100vh - 70px);\n  overflow-y: auto;\n}\n.sidebar h2 {\n  margin-bottom: var(--spacing-xl);\n  font-size: var(--font-size-xl);\n  color: var(--text-white);\n  padding-bottom: var(--spacing-md);\n  border-bottom: 2px solid var(--bg-dark-hover);\n}\n.sidebar-group {\n  margin-bottom: var(--spacing-md);\n}\n.sidebar-group-label {\n  display: block;\n  color: var(--gray-400);\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  padding: var(--spacing-sm) var(--spacing-md);\n  margin-bottom: var(--spacing-xs);\n}\n.sidebar-children {\n  display: flex;\n  flex-direction: column;\n}\n.sidebar-subgroup {\n  margin-bottom: var(--spacing-xs);\n}\n.sidebar-subgroup-toggle {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  box-sizing: border-box;\n  background: none;\n  border: none;\n  color: var(--gray-300);\n  font-size: 0.9rem;\n  font-weight: 500;\n  padding: var(--spacing-md);\n  margin-bottom: var(--spacing-xs);\n  margin-left: 0;\n  cursor: pointer;\n  transition: var(--transition);\n  border-radius: var(--border-radius);\n  border-left: 3px solid transparent;\n}\n.sidebar-subgroup-toggle:hover {\n  color: var(--text-white);\n  background: var(--bg-dark-hover);\n}\n.sidebar-chevron {\n  font-size: 0.6rem;\n  transition: transform 0.2s ease;\n}\n.sidebar-chevron.open {\n  transform: rotate(0deg);\n}\n.sidebar-chevron:not(.open) {\n  transform: rotate(-90deg);\n}\n.sidebar-subchildren {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  overflow: hidden;\n  max-height: 0;\n  opacity: 0;\n  transition: max-height 0.25s ease, opacity 0.2s ease;\n  padding-right: var(--spacing-md);\n  margin-left: 0;\n}\n.sidebar-subchildren.open {\n  max-height: 12rem;\n  opacity: 1;\n}\n.sidebar-subchildren .sidebar-child {\n  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 2rem;\n  margin-bottom: 0;\n  margin-top: 0;\n  margin-right: 0;\n  font-size: 0.875rem;\n  width: 100%;\n  box-sizing: border-box;\n}\n.sidebar-subchildren .sidebar-child:first-child {\n  margin-top: var(--spacing-xs);\n}\n.sidebar-subchildren a {\n  transform: none;\n}\n.sidebar-subchildren a:hover {\n  background: var(--bg-dark-hover);\n  color: var(--text-white);\n}\n.sidebar-subchildren a.active {\n  background: rgba(37, 99, 235, 0.2);\n  color: var(--text-white);\n  border-left-color: var(--primary, #2563eb);\n  box-shadow: none;\n}\n.sidebar-child {\n  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) var(--spacing-2xl);\n  margin-bottom: var(--spacing-xs);\n  border-left: 3px solid transparent;\n  font-size: 0.9rem;\n}\n.sidebar-child:hover {\n  border-left-color: var(--gray-500);\n}\n.sidebar-child.active {\n  border-left-color: var(--primary, #2563eb);\n}\n.sidebar a {\n  color: var(--gray-300);\n  text-decoration: none;\n  padding: var(--spacing-md);\n  border-radius: var(--border-radius);\n  margin-bottom: var(--spacing-xs);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n  transition: var(--transition);\n  font-weight: 500;\n}\n.sidebar a:hover {\n  background: var(--bg-dark-hover);\n  color: var(--text-white);\n  transform: translateX(4px);\n}\n.sidebar > a.active,\n.sidebar-children > .sidebar-child.active {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: var(--text-white);\n  box-shadow: var(--shadow);\n}\n.content {\n  flex: 1;\n  padding: var(--spacing-2xl);\n  overflow-y: auto;\n}\n.content header {\n  margin-bottom: var(--spacing-xl);\n  padding-bottom: var(--spacing-md);\n  border-bottom: 2px solid var(--border-color);\n}\n.content header h1 {\n  font-size: var(--font-size-2xl);\n  font-weight: 700;\n  color: var(--text-primary);\n  margin: 0;\n}\n.content header h1 span {\n  color: var(--primary);\n  font-weight: 600;\n}\n@media (max-width: 1024px) {\n  .sidebar {\n    width: 220px;\n  }\n}\n@media (max-width: 768px) {\n  .dashboard {\n    flex-direction: column;\n  }\n  .sidebar {\n    width: 100%;\n    height: auto;\n    position: relative;\n    top: 0;\n    padding: var(--spacing-md);\n  }\n  .sidebar a {\n    padding: var(--spacing-sm) var(--spacing-md);\n  }\n  .content {\n    padding: var(--spacing-md);\n  }\n}\n/*# sourceMappingURL=dashboard.css.map */\n";
  }
});

// src/app/services/dashboard.ts
var DashboardService;
var init_dashboard3 = __esm({
  "src/app/services/dashboard.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_api_gateway_service();
    DashboardService = class DashboardService2 {
      apiGateway;
      constructor(apiGateway) {
        this.apiGateway = apiGateway;
      }
      /**
       * Get the realm to display (from GET /identity/realms/user).
       */
      getRealmUser() {
        return this.apiGateway.getRealmUser();
      }
      static ctorParameters = () => [
        { type: ApiGatewayService }
      ];
    };
    DashboardService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], DashboardService);
  }
});

// src/app/dashboard/dashboard.ts
var DashboardComponent;
var init_dashboard4 = __esm({
  "src/app/dashboard/dashboard.ts"() {
    "use strict";
    init_tslib_es6();
    init_dashboard();
    init_dashboard2();
    init_core();
    init_common();
    init_router();
    init_esm();
    init_operators();
    init_dashboard3();
    init_api_gateway_service();
    init_auth_storage();
    DashboardComponent = class DashboardComponent2 {
      route;
      dashboardService;
      apiGateway;
      realmName = "Unknown Realm";
      products = [];
      loadingProducts = false;
      usersAndRolesMenuOpen = true;
      destroy$ = new Subject();
      constructor(route, dashboardService, apiGateway) {
        this.route = route;
        this.dashboardService = dashboardService;
        this.apiGateway = apiGateway;
      }
      ngOnInit() {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
          const realmFromQuery = params["realm"];
          if (realmFromQuery) {
            this.realmName = realmFromQuery;
            setStoredRealm(realmFromQuery);
            this.loadProducts();
          } else {
            this.realmName = getStoredRealm() || "Unknown Realm";
            this.loadProducts();
            this.dashboardService.getRealmUser().subscribe({
              next: (realm) => {
                const name = realm?.trim() || getStoredRealm() || "Unknown Realm";
                this.realmName = name;
                if (name !== "Unknown Realm") {
                  setStoredRealm(name);
                  this.loadProducts();
                } else {
                  this.products = [];
                  this.loadingProducts = false;
                }
              },
              error: () => {
                this.realmName = getStoredRealm() || "Unknown Realm";
                if (this.realmName !== "Unknown Realm") {
                  this.loadProducts();
                } else {
                  this.products = [];
                  this.loadingProducts = false;
                }
              }
            });
          }
        });
      }
      ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
      }
      loadProducts() {
        if (!this.realmName || this.realmName === "Unknown Realm") {
          this.products = [];
          this.loadingProducts = false;
          return;
        }
        this.loadingProducts = true;
        this.apiGateway.getProducts(this.realmName).subscribe({
          next: (data) => {
            this.products = data ?? [];
            this.loadingProducts = false;
          },
          error: () => {
            this.products = [];
            this.loadingProducts = false;
          }
        });
      }
      static ctorParameters = () => [
        { type: ActivatedRoute },
        { type: DashboardService },
        { type: ApiGatewayService }
      ];
    };
    DashboardComponent = __decorate([
      Component({
        selector: "app-dashboard",
        standalone: true,
        imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
        template: dashboard_default,
        styles: [dashboard_default2]
      })
    ], DashboardComponent);
  }
});

// src/app/dashboard/dashboard.spec.ts
var require_dashboard_spec = __commonJS({
  "src/app/dashboard/dashboard.spec.ts"(exports) {
    init_testing();
    init_router();
    init_esm();
    init_dashboard4();
    init_dashboard3();
    init_api_gateway_service();
    describe("DashboardComponent", () => {
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [DashboardComponent],
          providers: [
            {
              provide: ActivatedRoute,
              useValue: { queryParams: of({}) }
            },
            {
              provide: DashboardService,
              useValue: {
                getRealmUser: () => of("test-realm")
              }
            },
            {
              provide: ApiGatewayService,
              useValue: {
                getProducts: () => of([])
              }
            }
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(DashboardComponent);
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(fixture.componentInstance).toBeTruthy();
      });
    });
  }
});
export default require_dashboard_spec();
//# sourceMappingURL=spec-app-dashboard-dashboard.spec.js.map
