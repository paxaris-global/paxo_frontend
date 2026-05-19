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

// angular:jit:template:src/app/settings/settings.html
var settings_default;
var init_settings = __esm({
  "angular:jit:template:src/app/settings/settings.html"() {
    settings_default = "<p>settings works!</p>\n";
  }
});

// angular:jit:style:src/app/settings/settings.css
var settings_default2;
var init_settings2 = __esm({
  "angular:jit:style:src/app/settings/settings.css"() {
    settings_default2 = "/* src/app/settings/settings.css */\n.settings-page {\n  max-width: 900px;\n  margin: 0 auto;\n}\n.settings-section {\n  background: var(--bg-primary);\n  padding: var(--spacing-xl);\n  border-radius: var(--border-radius-lg);\n  margin-bottom: var(--spacing-lg);\n  box-shadow: var(--shadow);\n  border-top: 4px solid var(--primary);\n}\n.settings-section h3 {\n  margin-bottom: var(--spacing-lg);\n  color: var(--text-primary);\n  font-size: var(--font-size-xl);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n/*# sourceMappingURL=settings.css.map */\n";
  }
});

// src/app/settings/settings.ts
var Settings;
var init_settings3 = __esm({
  "src/app/settings/settings.ts"() {
    "use strict";
    init_tslib_es6();
    init_settings();
    init_settings2();
    init_core();
    Settings = class Settings2 {
    };
    Settings = __decorate([
      Component({
        selector: "app-settings",
        imports: [],
        template: settings_default,
        styles: [settings_default2]
      })
    ], Settings);
  }
});

// src/app/settings/settings.spec.ts
var require_settings_spec = __commonJS({
  "src/app/settings/settings.spec.ts"(exports) {
    init_testing();
    init_settings3();
    describe("Settings", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [Settings]
        }).compileComponents();
        fixture = TestBed.createComponent(Settings);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_settings_spec();
//# sourceMappingURL=spec-app-settings-settings.spec.js.map
