import {
  KeycloakService,
  init_keycloak
} from "./chunk-F53MEQXK.js";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  init_forms
} from "./chunk-CCNVDURJ.js";
import {
  CommonModule,
  init_common
} from "./chunk-C3KVU4UK.js";
import "./chunk-OKQC65K7.js";
import {
  getStoredRealm,
  init_auth_storage,
  init_http,
  provideHttpClient
} from "./chunk-2RYQMDFA.js";
import "./chunk-KK3UVDLS.js";
import {
  ANIMATION_MODULE_TYPE,
  Component,
  DOCUMENT,
  EventEmitter,
  FactoryTarget,
  Inject,
  Injectable,
  Output,
  PLATFORM_ID,
  RendererFactory2,
  RuntimeError,
  TestBed,
  ViewEncapsulation,
  __decorate,
  core_exports,
  init_core,
  init_testing,
  init_tslib_es6,
  inject,
  ɵɵngDeclareClassMetadata,
  ɵɵngDeclareFactory,
  ɵɵngDeclareInjectable
} from "./chunk-G6FXXSSP.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-TTULUY32.js";

// angular:jit:template:src/app/create-product/create-product.html
var create_product_default;
var init_create_product = __esm({
  "angular:jit:template:src/app/create-product/create-product.html"() {
    create_product_default = '<div class="form-card section-product">\n  <h3><i class="fa-solid fa-gears"></i> Create New Product</h3>\n  <p class="hint">Create via API using realm + product details + backend/frontend source ZIP files.</p>\n\n  <form [formGroup]="productForm" (ngSubmit)="createProduct()" enctype="multipart/form-data">\n    <div class="field">\n      <label for="realm"><i class="fa-solid fa-database"></i> Realm</label>\n      <app-project-generator-hero (generate)="createProduct()"></app-project-generator-hero>\n      <input\n        id="realm"\n        type="text"\n        formControlName="realm"\n        placeholder="e.g. test2"\n        readonly\n      />\n    </div>\n    <div class="field">\n      <label for="productId"><i class="fa-solid fa-id-badge"></i> Product ID</label>\n      <input\n        id="productId"\n        type="text"\n        formControlName="productId"\n        placeholder="e.g. test-product5"\n      />\n    </div>\n    <div class="field">\n      <label for="frontendBaseUrl"><i class="fa-solid fa-link"></i> Frontend Base URL</label>\n      <input\n        id="frontendBaseUrl"\n        type="text"\n        formControlName="frontendBaseUrl"\n        placeholder="e.g. http://localhost:8083"\n      />\n    </div>\n    <div class="field checkbox-field">\n      <label>\n        <input type="checkbox" formControlName="publicClient" />\n        Public product\n      </label>\n    </div>\n\n    <hr class="divider" />\n    <div class="field">\n      <label for="backendZip"><i class="fa-solid fa-file-archive"></i> Backend ZIP</label>\n      <input\n        id="backendZip"\n        type="file"\n        (change)="onBackendZipSelected($event)"\n        accept=".zip"\n      />\n      <small *ngIf="selectedBackendZip" class="file-name">{{ selectedBackendZip.name }}</small>\n    </div>\n\n    <div class="field">\n      <label for="frontendZip"><i class="fa-solid fa-file-archive"></i> Frontend ZIP</label>\n      <input\n        id="frontendZip"\n        type="file"\n        (change)="onFrontendZipSelected($event)"\n        accept=".zip"\n      />\n      <small *ngIf="selectedFrontendZip" class="file-name">{{ selectedFrontendZip.name }}</small>\n    </div>\n\n    <button type="submit">\n      <i class="fa-solid fa-plus-circle"></i> Create Product\n    </button>\n  </form>\n\n  <div *ngIf="responseMessage" class="response-message">\n    {{ responseMessage }}\n  </div>\n</div>\n';
  }
});

// angular:jit:style:src/app/create-product/create-product.css
var create_product_default2;
var init_create_product2 = __esm({
  "angular:jit:style:src/app/create-product/create-product.css"() {
    create_product_default2 = "/* src/app/create-product/create-product.css */\n.form-card {\n  background: var(--bg-primary);\n  border-radius: var(--border-radius-lg);\n  padding: var(--spacing-xl);\n  box-shadow: var(--shadow);\n  margin-bottom: var(--spacing-lg);\n}\n.section-product {\n  border-top: 4px solid var(--primary);\n}\n.form-card h3 {\n  margin-bottom: var(--spacing-lg);\n  color: var(--text-primary);\n  font-size: var(--font-size-xl);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n.field {\n  display: flex;\n  flex-direction: column;\n  margin-bottom: var(--spacing-md);\n}\n.field label {\n  font-weight: 500;\n  margin-bottom: var(--spacing-xs);\n  color: var(--text-primary);\n  font-size: var(--font-size-sm);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-xs);\n}\ninput[type=text],\ninput[type=file],\nselect {\n  padding: var(--spacing-md);\n  border: 1px solid var(--border-color);\n  border-radius: var(--border-radius);\n  font-size: var(--font-size-base);\n  background: var(--bg-primary);\n  transition: var(--transition);\n}\ninput:focus,\nselect:focus {\n  outline: none;\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.file-name {\n  color: var(--primary);\n  margin-top: var(--spacing-xs);\n  font-weight: 500;\n  font-size: var(--font-size-sm);\n}\nbutton {\n  width: 100%;\n  padding: var(--spacing-md) var(--spacing-xl);\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary) 0%,\n      var(--primary-dark) 100%);\n  color: var(--text-white);\n  border: none;\n  border-radius: var(--border-radius);\n  font-size: var(--font-size-base);\n  font-weight: 600;\n  cursor: pointer;\n  transition: var(--transition);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--spacing-sm);\n}\nbutton:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: var(--shadow-md);\n}\nbutton:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n  transform: none;\n}\n.response-message {\n  margin-top: var(--spacing-md);\n  padding: var(--spacing-md);\n  text-align: center;\n  font-weight: 600;\n  border-radius: var(--border-radius);\n}\n.response-message:empty {\n  display: none;\n}\n.response-message.success {\n  background-color: #d1fae5;\n  color: #065f46;\n  border: 1px solid var(--success);\n}\n.response-message.error {\n  background-color: #fee2e2;\n  color: #991b1b;\n  border: 1px solid var(--error);\n}\n/*# sourceMappingURL=create-product.css.map */\n";
  }
});

// angular:jit:template:src/app/project-generator-hero/project-generator-hero.html
var project_generator_hero_default;
var init_project_generator_hero = __esm({
  "angular:jit:template:src/app/project-generator-hero/project-generator-hero.html"() {
    project_generator_hero_default = `<div class="hero-shell">
  <div class="hero-track">
    <div
      class="logo-wrap"
      [@logoMotion]="state"
      [class.burnout]="state === 'burnout'"
      [class.idle]="state === 'idle'"
      aria-hidden="true"
    >
      <div class="outer-ring"></div>
      <div class="core"></div>
    </div>

    <button
      type="button"
      class="generate-btn"
      [@buttonReveal]="buttonVisible ? 'visible' : 'hidden'"
      (click)="triggerGenerate()"
    >
      Generate Project
    </button>
  </div>
</div>
`;
  }
});

// angular:jit:style:src/app/project-generator-hero/project-generator-hero.css
var project_generator_hero_default2;
var init_project_generator_hero2 = __esm({
  "angular:jit:style:src/app/project-generator-hero/project-generator-hero.css"() {
    project_generator_hero_default2 = "/* src/app/project-generator-hero/project-generator-hero.css */\n.hero-shell {\n  width: 100%;\n  min-height: 92px;\n  display: flex;\n  align-items: center;\n}\n.hero-track {\n  width: min(520px, 100%);\n  height: 78px;\n  position: relative;\n  overflow: hidden;\n  border-radius: 999px;\n  display: flex;\n  align-items: center;\n  padding: 0 14px;\n  background: transparent;\n  border: 1px solid rgba(164, 131, 255, 0.16);\n  box-shadow: none;\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n}\n.logo-wrap {\n  width: 60px;\n  height: 60px;\n  border-radius: 50%;\n  position: relative;\n  flex: 0 0 60px;\n  cursor: default;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.logo-wrap.idle .outer-ring {\n  animation: heartbeat 1.8s ease-in-out infinite;\n}\n.logo-wrap.burnout .core {\n  animation: burnout-spin 200ms linear infinite, jitter 150ms ease-in-out infinite;\n}\n.outer-ring {\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  border: 1px solid rgba(125, 249, 255, 0.52);\n  box-shadow: 0 0 24px rgba(85, 223, 255, 0.45), inset 0 0 14px rgba(145, 111, 255, 0.45);\n  background:\n    radial-gradient(\n      circle at 30% 30%,\n      rgba(136, 98, 255, 0.35),\n      rgba(30, 25, 58, 0.26) 62%);\n}\n.core {\n  position: absolute;\n  inset: 9px;\n  border-radius: 50%;\n  background:\n    radial-gradient(\n      circle at 35% 35%,\n      #7df9ff 0%,\n      #8f57ff 35%,\n      #2c1d61 75%);\n  box-shadow: 0 0 28px rgba(124, 255, 255, 0.5), inset 0 0 12px rgba(255, 255, 255, 0.24);\n}\n.generate-btn {\n  position: absolute;\n  left: 96px;\n  height: 48px;\n  border-radius: 999px;\n  padding: 0 18px;\n  border: 1px solid rgba(143, 184, 255, 0.5);\n  color: #f5f7ff;\n  font-weight: 600;\n  letter-spacing: 0.02em;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(27, 122, 255, 0.34),\n      rgba(145, 83, 255, 0.24));\n  box-shadow: 0 14px 30px rgba(12, 24, 70, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  cursor: pointer;\n}\n.generate-btn:hover {\n  transform: translateY(-1px);\n}\n@keyframes heartbeat {\n  0%, 100% {\n    transform: scale(1);\n    box-shadow: 0 0 24px rgba(85, 223, 255, 0.45), inset 0 0 14px rgba(145, 111, 255, 0.45);\n  }\n  35% {\n    transform: scale(1.07);\n    box-shadow: 0 0 34px rgba(70, 198, 255, 0.55), inset 0 0 18px rgba(145, 111, 255, 0.56);\n  }\n  58% {\n    transform: scale(0.98);\n    box-shadow: 0 0 22px rgba(98, 124, 255, 0.42), inset 0 0 12px rgba(145, 111, 255, 0.35);\n  }\n}\n@keyframes burnout-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes jitter {\n  0% {\n    translate: 0 0;\n  }\n  25% {\n    translate: -0.5px 0.7px;\n  }\n  50% {\n    translate: 0.8px -0.8px;\n  }\n  75% {\n    translate: -0.7px -0.4px;\n  }\n  100% {\n    translate: 0 0;\n  }\n}\n@media (max-width: 640px) {\n  .hero-shell {\n    min-height: 84px;\n  }\n  .hero-track {\n    height: 72px;\n  }\n  .logo-wrap {\n    width: 54px;\n    height: 54px;\n    flex-basis: 54px;\n  }\n  .generate-btn {\n    left: 84px;\n    height: 44px;\n    font-size: 13px;\n    padding: 0 14px;\n  }\n}\n/*# sourceMappingURL=project-generator-hero.css.map */\n";
  }
});

// node_modules/@angular/animations/fesm2022/private_export.mjs
function trigger(name, definitions) {
  return { type: AnimationMetadataType.Trigger, name, definitions, options: {} };
}
function animate(timings, styles = null) {
  return { type: AnimationMetadataType.Animate, styles, timings };
}
function sequence(steps, options = null) {
  return { type: AnimationMetadataType.Sequence, steps, options };
}
function style(tokens) {
  return { type: AnimationMetadataType.Style, styles: tokens, offset: null };
}
function state(name, styles, options) {
  return { type: AnimationMetadataType.State, name, styles, options };
}
function transition(stateChangeExpr, steps, options = null) {
  return { type: AnimationMetadataType.Transition, expr: stateChangeExpr, animation: steps, options };
}
var AnimationMetadataType;
var init_private_export = __esm({
  "node_modules/@angular/animations/fesm2022/private_export.mjs"() {
    "use strict";
    (function(AnimationMetadataType2) {
      AnimationMetadataType2[AnimationMetadataType2["State"] = 0] = "State";
      AnimationMetadataType2[AnimationMetadataType2["Transition"] = 1] = "Transition";
      AnimationMetadataType2[AnimationMetadataType2["Sequence"] = 2] = "Sequence";
      AnimationMetadataType2[AnimationMetadataType2["Group"] = 3] = "Group";
      AnimationMetadataType2[AnimationMetadataType2["Animate"] = 4] = "Animate";
      AnimationMetadataType2[AnimationMetadataType2["Keyframes"] = 5] = "Keyframes";
      AnimationMetadataType2[AnimationMetadataType2["Style"] = 6] = "Style";
      AnimationMetadataType2[AnimationMetadataType2["Trigger"] = 7] = "Trigger";
      AnimationMetadataType2[AnimationMetadataType2["Reference"] = 8] = "Reference";
      AnimationMetadataType2[AnimationMetadataType2["AnimateChild"] = 9] = "AnimateChild";
      AnimationMetadataType2[AnimationMetadataType2["AnimateRef"] = 10] = "AnimateRef";
      AnimationMetadataType2[AnimationMetadataType2["Query"] = 11] = "Query";
      AnimationMetadataType2[AnimationMetadataType2["Stagger"] = 12] = "Stagger";
    })(AnimationMetadataType || (AnimationMetadataType = {}));
  }
});

// node_modules/@angular/animations/fesm2022/animations.mjs
function issueAnimationCommand(renderer, element, id, command, args) {
  renderer.setProperty(element, `@@${id}:${command}`, args);
}
function unwrapAnimationRenderer(renderer) {
  const type = renderer.\u0275type;
  if (type === 0) {
    return renderer;
  } else if (type === 1) {
    return renderer.animationRenderer;
  }
  return null;
}
function isAnimationRenderer(renderer) {
  const type = renderer.\u0275type;
  return type === 0 || type === 1;
}
var AnimationBuilder, AnimationFactory, BrowserAnimationBuilder, BrowserAnimationFactory, RendererAnimationPlayer;
var init_animations = __esm({
  "node_modules/@angular/animations/fesm2022/animations.mjs"() {
    "use strict";
    init_common();
    init_core();
    init_core();
    init_private_export();
    init_private_export();
    AnimationBuilder = class _AnimationBuilder {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _AnimationBuilder, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _AnimationBuilder, providedIn: "root", useFactory: () => inject(BrowserAnimationBuilder) });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: AnimationBuilder, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root", useFactory: () => inject(BrowserAnimationBuilder) }]
    }] });
    AnimationFactory = class {
    };
    BrowserAnimationBuilder = class _BrowserAnimationBuilder extends AnimationBuilder {
      animationModuleType = inject(ANIMATION_MODULE_TYPE, { optional: true });
      _nextAnimationId = 0;
      _renderer;
      constructor(rootRenderer, doc) {
        super();
        const typeData = {
          id: "0",
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: { animation: [] }
        };
        this._renderer = rootRenderer.createRenderer(doc.body, typeData);
        if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
          throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
        }
      }
      build(animation2) {
        const id = this._nextAnimationId;
        this._nextAnimationId++;
        const entry = Array.isArray(animation2) ? sequence(animation2) : animation2;
        issueAnimationCommand(this._renderer, null, id, "register", [entry]);
        return new BrowserAnimationFactory(id, this._renderer);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _BrowserAnimationBuilder, deps: [{ token: RendererFactory2 }, { token: DOCUMENT }], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: _BrowserAnimationBuilder, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: core_exports, type: BrowserAnimationBuilder, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }], ctorParameters: () => [{ type: RendererFactory2 }, { type: Document, decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }] }] });
    BrowserAnimationFactory = class extends AnimationFactory {
      _id;
      _renderer;
      constructor(_id, _renderer) {
        super();
        this._id = _id;
        this._renderer = _renderer;
      }
      create(element, options) {
        return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
      }
    };
    RendererAnimationPlayer = class {
      id;
      element;
      _renderer;
      parentPlayer = null;
      _started = false;
      constructor(id, element, options, _renderer) {
        this.id = id;
        this.element = element;
        this._renderer = _renderer;
        this._command("create", options);
      }
      _listen(eventName, callback) {
        return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
      }
      _command(command, ...args) {
        issueAnimationCommand(this._renderer, this.element, this.id, command, args);
      }
      onDone(fn) {
        this._listen("done", fn);
      }
      onStart(fn) {
        this._listen("start", fn);
      }
      onDestroy(fn) {
        this._listen("destroy", fn);
      }
      init() {
        this._command("init");
      }
      hasStarted() {
        return this._started;
      }
      play() {
        this._command("play");
        this._started = true;
      }
      pause() {
        this._command("pause");
      }
      restart() {
        this._command("restart");
      }
      finish() {
        this._command("finish");
      }
      destroy() {
        this._command("destroy");
      }
      reset() {
        this._command("reset");
        this._started = false;
      }
      setPosition(p) {
        this._command("setPosition", p);
      }
      getPosition() {
        return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
      }
      totalTime = 0;
    };
  }
});

// src/app/project-generator-hero/project-generator-hero.ts
var ProjectGeneratorHeroComponent;
var init_project_generator_hero3 = __esm({
  "src/app/project-generator-hero/project-generator-hero.ts"() {
    "use strict";
    init_tslib_es6();
    init_project_generator_hero();
    init_project_generator_hero2();
    init_core();
    init_common();
    init_animations();
    ProjectGeneratorHeroComponent = class ProjectGeneratorHeroComponent2 {
      generate = new EventEmitter();
      state = "idle";
      buttonVisible = false;
      animating = false;
      ngOnInit() {
        this.startSequence();
      }
      startSequence() {
        if (this.animating)
          return;
        if (this.state === "collapsed") {
          this.generate.emit();
          return;
        }
        this.animating = true;
        this.state = "burnout";
        this.buttonVisible = false;
        setTimeout(() => {
          this.state = "collapsed";
          this.buttonVisible = true;
          this.animating = false;
        }, 900);
      }
      triggerGenerate() {
        this.generate.emit();
      }
      static propDecorators = {
        generate: [{ type: Output }]
      };
    };
    ProjectGeneratorHeroComponent = __decorate([
      Component({
        selector: "app-project-generator-hero",
        standalone: true,
        imports: [CommonModule],
        template: project_generator_hero_default,
        animations: [
          trigger("logoMotion", [
            state("idle", style({
              transform: "translateX(0)"
            })),
            state("burnout", style({
              transform: "translateX(0)"
            })),
            state("collapsed", style({
              transform: "translateX(-45%)"
            })),
            transition("idle => burnout", [animate("300ms ease-out")]),
            transition("burnout => collapsed", [animate("760ms cubic-bezier(0.22, 1, 0.36, 1)")])
          ]),
          trigger("buttonReveal", [
            state("hidden", style({
              opacity: 0,
              transform: "translateX(-18px)",
              pointerEvents: "none"
            })),
            state("visible", style({
              opacity: 1,
              transform: "translateX(0)",
              pointerEvents: "auto"
            })),
            transition("hidden => visible", [animate("520ms cubic-bezier(0.16, 1, 0.3, 1)")]),
            transition("visible => hidden", [animate("240ms ease-in")])
          ])
        ],
        styles: [project_generator_hero_default2]
      })
    ], ProjectGeneratorHeroComponent);
  }
});

// src/app/create-product/create-product.ts
var CreateProductComponent;
var init_create_product3 = __esm({
  "src/app/create-product/create-product.ts"() {
    "use strict";
    init_tslib_es6();
    init_create_product();
    init_create_product2();
    init_core();
    init_forms();
    init_common();
    init_core();
    init_keycloak();
    init_auth_storage();
    init_project_generator_hero3();
    CreateProductComponent = class CreateProductComponent2 {
      fb;
      keycloakService;
      platformId;
      productForm;
      selectedBackendZip = null;
      selectedFrontendZip = null;
      responseMessage = "";
      constructor(fb, keycloakService, platformId) {
        this.fb = fb;
        this.keycloakService = keycloakService;
        this.platformId = platformId;
      }
      ngOnInit() {
        this.productForm = this.fb.group({
          realm: [{ value: getStoredRealm() || "", disabled: true }],
          productId: [""],
          publicClient: [false],
          frontendBaseUrl: ["http://localhost:8083"]
        });
      }
      onBackendZipSelected(event) {
        const file = event.target.files?.[0];
        if (file)
          this.selectedBackendZip = file;
      }
      onFrontendZipSelected(event) {
        const file = event.target.files?.[0];
        if (file)
          this.selectedFrontendZip = file;
      }
      createProduct() {
        const realm = (this.productForm.getRawValue().realm || "").trim();
        const productId = (this.productForm.get("productId")?.value || "").trim();
        if (!realm || !productId) {
          this.responseMessage = "\u26A0\uFE0F Realm and Product ID are required.";
          return;
        }
        if (!this.selectedBackendZip || !this.selectedFrontendZip) {
          this.responseMessage = "\u26A0\uFE0F Backend ZIP and Frontend ZIP are required.";
          return;
        }
        const frontendBaseUrl = (this.productForm.get("frontendBaseUrl")?.value || "").trim();
        if (!frontendBaseUrl) {
          this.responseMessage = "\u26A0\uFE0F Frontend Base URL is required.";
          return;
        }
        const productPayload = {
          productId,
          publicClient: this.productForm.get("publicClient")?.value ?? false
        };
        this.keycloakService.createProductWithFile(realm, productPayload, this.selectedBackendZip, this.selectedFrontendZip, frontendBaseUrl).subscribe({
          next: () => {
            this.responseMessage = "\u2705 Product created and source code uploaded successfully!";
            this.productForm.reset({ publicClient: false, frontendBaseUrl: "http://localhost:8083" });
            this.selectedBackendZip = null;
            this.selectedFrontendZip = null;
          },
          error: (err) => {
            console.error(err);
            this.responseMessage = "\u274C " + (err.error?.message || "Failed to create product.");
          }
        });
      }
      static ctorParameters = () => [
        { type: FormBuilder },
        { type: KeycloakService },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID] }] }
      ];
    };
    CreateProductComponent = __decorate([
      Component({
        selector: "app-create-product",
        standalone: true,
        imports: [CommonModule, FormsModule, ReactiveFormsModule, ProjectGeneratorHeroComponent],
        template: create_product_default,
        styles: [create_product_default2]
      })
    ], CreateProductComponent);
  }
});

// src/app/create-product/create-product.spec.ts
var require_create_product_spec = __commonJS({
  "src/app/create-product/create-product.spec.ts"(exports) {
    init_testing();
    init_http();
    init_create_product3();
    init_keycloak();
    describe("CreateProductComponent", () => {
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [CreateProductComponent],
          providers: [KeycloakService, provideHttpClient()]
        }).compileComponents();
        fixture = TestBed.createComponent(CreateProductComponent);
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(fixture.componentInstance).toBeTruthy();
      });
    });
  }
});
export default require_create_product_spec();
/*! Bundled license information:

@angular/animations/fesm2022/private_export.mjs:
@angular/animations/fesm2022/animations.mjs:
  (**
   * @license Angular v20.2.1
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=spec-app-create-product-create-product.spec.js.map
