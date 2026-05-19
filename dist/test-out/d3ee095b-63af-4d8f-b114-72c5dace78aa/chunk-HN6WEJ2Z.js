import {
  Router,
  RouterLink,
  RouterLinkActive,
  init_router
} from "./chunk-CAH3UFKY.js";
import {
  CommonModule,
  init_common
} from "./chunk-C3KVU4UK.js";
import {
  clearAuthState,
  init_auth_storage,
  isLoggedIn
} from "./chunk-2RYQMDFA.js";
import {
  Component,
  __decorate,
  init_core,
  init_tslib_es6
} from "./chunk-G6FXXSSP.js";
import {
  __esm
} from "./chunk-TTULUY32.js";

// angular:jit:template:src/app/navbar/navbar.html
var navbar_default;
var init_navbar = __esm({
  "angular:jit:template:src/app/navbar/navbar.html"() {
    navbar_default = '<nav class="nav">\n  <div class="title">\u{1F510} Paxaris Global</div>\n\n  <div class="actions">\n    @if (!loggedIn) {\n      <a routerLink="/login" routerLinkActive="active" class="btn ghost">Login</a>\n      <a routerLink="/signup" routerLinkActive="active" class="btn primary">Signup</a>\n    } @else {\n      <!-- <a routerLink="/dashboard" routerLinkActive="active" class="btn ghost">Dashboard</a> -->\n      <a href="#" (click)="logout($event)" class="btn primary">Logout</a>\n    }\n  </div>\n</nav>\n';
  }
});

// angular:jit:style:src/app/navbar/navbar.css
var navbar_default2;
var init_navbar2 = __esm({
  "angular:jit:style:src/app/navbar/navbar.css"() {
    navbar_default2 = "/* src/app/navbar/navbar.css */\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n  color: var(--text-white);\n  box-shadow: var(--shadow-md);\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n}\n.title {\n  font-size: var(--font-size-xl);\n  font-weight: 700;\n  background:\n    linear-gradient(\n      135deg,\n      #60a5fa 0%,\n      #3b82f6 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n.actions {\n  display: flex;\n  gap: var(--spacing-md);\n  align-items: center;\n}\n.btn {\n  padding: 0.5rem 1.25rem;\n  border-radius: var(--border-radius);\n  text-decoration: none;\n  font-weight: 500;\n  font-size: var(--font-size-sm);\n  cursor: pointer;\n  transition: var(--transition);\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-xs);\n}\n.btn.ghost {\n  color: var(--gray-300);\n  border: 1px solid var(--gray-600);\n  background: transparent;\n}\n.btn.ghost:hover {\n  background: rgba(255, 255, 255, 0.1);\n  border-color: var(--gray-400);\n  color: var(--text-white);\n}\n.btn.primary {\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #2563eb 100%);\n  color: var(--text-white);\n  border: none;\n}\n.btn.primary:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1e40af 100%);\n  transform: translateY(-1px);\n  box-shadow: var(--shadow-md);\n}\n.btn.active {\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);\n}\n@media (max-width: 768px) {\n  .nav {\n    padding: 0.75rem 1rem;\n  }\n  .title {\n    font-size: var(--font-size-lg);\n  }\n  .actions {\n    gap: var(--spacing-sm);\n  }\n  .btn {\n    padding: 0.5rem 1rem;\n    font-size: var(--font-size-xs);\n  }\n}\n/*# sourceMappingURL=navbar.css.map */\n";
  }
});

// src/app/navbar/navbar.ts
var NavbarComponent;
var init_navbar3 = __esm({
  "src/app/navbar/navbar.ts"() {
    "use strict";
    init_tslib_es6();
    init_navbar();
    init_navbar2();
    init_core();
    init_common();
    init_router();
    init_auth_storage();
    NavbarComponent = class NavbarComponent2 {
      router;
      constructor(router) {
        this.router = router;
      }
      get loggedIn() {
        return isLoggedIn();
      }
      logout($event) {
        $event.preventDefault();
        clearAuthState();
        this.router.navigate(["/login"]);
      }
      static ctorParameters = () => [
        { type: Router }
      ];
    };
    NavbarComponent = __decorate([
      Component({
        selector: "app-navbar",
        standalone: true,
        imports: [CommonModule, RouterLink, RouterLinkActive],
        template: navbar_default,
        styles: [navbar_default2]
      })
    ], NavbarComponent);
  }
});

export {
  NavbarComponent,
  init_navbar3 as init_navbar
};
//# sourceMappingURL=chunk-HN6WEJ2Z.js.map
