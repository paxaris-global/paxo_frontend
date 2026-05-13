import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { KeycloakService } from './keycloak';

describe('Keycloak', () => {
  let service: KeycloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(KeycloakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
