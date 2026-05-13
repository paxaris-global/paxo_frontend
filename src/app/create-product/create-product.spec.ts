import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CreateProductComponent } from './create-product';
import { KeycloakService } from '../services/keycloak';

describe('CreateProductComponent', () => {
  let fixture: ComponentFixture<CreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductComponent],
      providers: [KeycloakService, provideHttpClient(), provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
