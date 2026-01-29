import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { KeycloakService } from '../services/keycloak';
import { ApiGatewayService } from '../services/api-gateway.service';
import { CreateClientRequest } from '../models';
import { getStoredRealm } from '../auth-storage';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-client.html',
  styleUrls: ['./create-client.css'],
})
export class CreateClientComponent implements OnInit {
  clientForm!: FormGroup;
  selectedFile: File | null = null;
  responseMessage = '';

  constructor(
    private fb: FormBuilder,
    private keycloakService: KeycloakService,
    private apiGateway: ApiGatewayService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.clientForm = this.fb.group({
      realm: [{ value: getStoredRealm() || '', disabled: true }],
      clientId: [''],
      publicClient: [false],
      urls: [''], // comma-separated or single URL
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.selectedFile = file;
  }

  createClient() {
    const realm = (this.clientForm.getRawValue().realm || '').trim();
    const clientId = (this.clientForm.get('clientId')?.value || '').trim();

    if (this.selectedFile) {
      if (!clientId) {
        this.responseMessage = '⚠️ Product ID is required for file upload.';
        return;
      }
      this.keycloakService.uploadClient(clientId, this.selectedFile).subscribe({
        next: () => {
          this.responseMessage = '✅ Product and Docker image uploaded successfully!';
          this.clientForm.reset({ publicClient: false });
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('❌ Error uploading:', err);
          this.responseMessage = '❌ Failed to upload product or Docker image.';
        },
      });
      return;
    }

    if (!realm || !clientId) {
      this.responseMessage = '⚠️ Realm and Product ID are required (or upload a Docker image with Product ID).';
      return;
    }

    const urlsStr = (this.clientForm.get('urls')?.value || '').trim();
    const urls = urlsStr ? urlsStr.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    if (urls.length === 0) {
      this.responseMessage = '⚠️ At least one URL is required (e.g. https://localhost:8083).';
      return;
    }

    const body: CreateClientRequest = {
      clientId,
      publicClient: this.clientForm.get('publicClient')?.value ?? false,
      urls,
    };
    this.apiGateway.createClient(realm, body).subscribe({
      next: () => {
        this.responseMessage = '✅ Product created successfully!';
        this.clientForm.reset({ publicClient: false });
      },
      error: (err) => {
        console.error('❌ Error creating client:', err);
        this.responseMessage = '❌ ' + (err.error?.message || err.message || 'Failed to create product.');
      },
    });
  }
}
