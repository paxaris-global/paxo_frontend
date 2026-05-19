import {
  KeycloakService,
  init_keycloak
} from "./chunk-EOATDBBI.js";
import "./chunk-WHVCLFVD.js";
import {
  init_http,
  provideHttpClient
} from "./chunk-NLLKBMSJ.js";
import "./chunk-IWFMZ7NL.js";
import {
  TestBed,
  init_testing
} from "./chunk-5VF64QHA.js";
import "./chunk-V6FC2DIM.js";

// src/app/services/keycloak.spec.ts
init_testing();
init_http();
init_keycloak();
describe("Keycloak", () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(KeycloakService);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
//# sourceMappingURL=spec-app-services-keycloak.spec.js.map
