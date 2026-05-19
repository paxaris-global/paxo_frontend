import {
  NavbarComponent,
  init_navbar
} from "./chunk-XVQIYMEK.js";
import {
  init_router,
  provideRouter
} from "./chunk-RUMTJXB2.js";
import "./chunk-BUAUFQFR.js";
import "./chunk-NLLKBMSJ.js";
import "./chunk-IWFMZ7NL.js";
import {
  TestBed,
  init_testing
} from "./chunk-5VF64QHA.js";
import {
  __async,
  __commonJS
} from "./chunk-V6FC2DIM.js";

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
