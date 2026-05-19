import {
  NavbarComponent,
  init_navbar
} from "./chunk-HN6WEJ2Z.js";
import {
  init_router,
  provideRouter
} from "./chunk-CAH3UFKY.js";
import "./chunk-TXZUCGYE.js";
import "./chunk-C3KVU4UK.js";
import "./chunk-2RYQMDFA.js";
import "./chunk-KK3UVDLS.js";
import {
  TestBed,
  init_testing
} from "./chunk-G6FXXSSP.js";
import {
  __async,
  __commonJS
} from "./chunk-TTULUY32.js";

// src/app/navbar/navbar.spec.ts
var require_navbar_spec = __commonJS({
  "src/app/navbar/navbar.spec.ts"(exports) {
    init_testing();
    init_router();
    init_navbar();
    describe("NavbarComponent", () => {
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [NavbarComponent],
          providers: [provideRouter([])]
        }).compileComponents();
        fixture = TestBed.createComponent(NavbarComponent);
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(fixture.componentInstance).toBeTruthy();
      });
    });
  }
});
export default require_navbar_spec();
//# sourceMappingURL=spec-app-navbar-navbar.spec.js.map
