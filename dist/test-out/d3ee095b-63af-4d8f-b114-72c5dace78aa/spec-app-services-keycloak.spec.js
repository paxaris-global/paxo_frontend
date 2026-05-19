import {
  KeycloakService,
  init_keycloak
} from "./chunk-F53MEQXK.js";
import "./chunk-OKQC65K7.js";
import "./chunk-2RYQMDFA.js";
import "./chunk-KK3UVDLS.js";
import {
  TestBed,
  init_testing
} from "./chunk-G6FXXSSP.js";
import "./chunk-TTULUY32.js";

// src/app/services/keycloak.spec.ts
init_testing();
init_keycloak();
describe("Keycloak", () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeycloakService);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
//# sourceMappingURL=spec-app-services-keycloak.spec.js.map
