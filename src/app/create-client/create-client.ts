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

  if (!realm || !clientId) {
    this.responseMessage = '⚠️ Realm and Product ID are required.';
    return;
  }

  if (!this.selectedFile) {
    this.responseMessage = '⚠️ Docker image (zip) is required.';
    return;
  }

  const urlsStr = (this.clientForm.get('urls')?.value || '').trim();
  const urls = urlsStr
    ? urlsStr.split(',').map((u: string) => u.trim()).filter(Boolean)
    : [];

  const clientPayload = {
    clientId,
    publicClient: this.clientForm.get('publicClient')?.value ?? false,
    urls
  };

  this.keycloakService
    .createClientWithFile(realm, clientPayload, this.selectedFile)
    .subscribe({
      next: () => {
        this.responseMessage = '✅ Product created and image uploaded successfully!';
        this.clientForm.reset({ publicClient: false });
        this.selectedFile = null;
      },
      error: (err) => {
        console.error(err);
        this.responseMessage =
          '❌ ' + (err.error?.message || 'Failed to create product.');
      },
    });
}

}
