import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { KeycloakService } from '../services/keycloak';
import { getStoredRealm } from '../auth-storage';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrls: ['./create-product.css'],
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  selectedBackendZip: File | null = null;
  selectedFrontendZip: File | null = null;
  responseMessage = '';

  constructor(
    private fb: FormBuilder,
    private keycloakService: KeycloakService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      realm: [{ value: getStoredRealm() || '', disabled: true }],
      productId: [''],
      publicClient: [false],
      frontendBaseUrl: ['http://localhost:8083'],
    });
  }

  onBackendZipSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.selectedBackendZip = file;
  }

  onFrontendZipSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.selectedFrontendZip = file;
  }

  createProduct() {
  const realm = (this.productForm.getRawValue().realm || '').trim();
  const productId = (this.productForm.get('productId')?.value || '').trim();

  if (!realm || !productId) {
    this.responseMessage = '⚠️ Realm and Product ID are required.';
    return;
  }

  if (!this.selectedBackendZip || !this.selectedFrontendZip) {
    this.responseMessage = '⚠️ Backend ZIP and Frontend ZIP are required.';
    return;
  }

  const frontendBaseUrl = (this.productForm.get('frontendBaseUrl')?.value || '').trim();
  if (!frontendBaseUrl) {
    this.responseMessage = '⚠️ Frontend Base URL is required.';
    return;
  }

  const productPayload = {
    productId,
    publicClient: this.productForm.get('publicClient')?.value ?? false
  };

  this.keycloakService
    .createProductWithFile(
      realm,
      productPayload,
      this.selectedBackendZip,
      this.selectedFrontendZip,
      frontendBaseUrl
    )
    .subscribe({
      next: () => {
        this.responseMessage = '✅ Product created and source code uploaded successfully!';
        this.productForm.reset({ publicClient: false, frontendBaseUrl: 'http://localhost:8083' });
        this.selectedBackendZip = null;
        this.selectedFrontendZip = null;
      },
      error: (err: any) => {
        console.error(err);
        this.responseMessage =
          '❌ ' + (err.error?.message || 'Failed to create product.');
      },
    });
}

}
