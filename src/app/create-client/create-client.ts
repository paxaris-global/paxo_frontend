import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { KeycloakService } from '../services/keycloak';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-client.html',
  styleUrls: ['./create-client.css']
})
export class CreateClientComponent implements OnInit {
  clientForm!: FormGroup;
  selectedFile: File | null = null;
  responseMessage = '';

  constructor(private fb: FormBuilder, private keycloakService: KeycloakService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.clientForm = this.fb.group({
      clientId: [''],
      publicClient: [{ value: true, disabled: true }],
      enabled: [{ value: true, disabled: true }],
      protocol: [{ value: 'openid-connect', disabled: true }]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  createClient() {
    if (!this.selectedFile) {
      this.responseMessage = '⚠️ Please select a Docker image file.';
      return;
    }

    const clientId = this.clientForm.getRawValue().clientId;
    this.keycloakService.uploadClient(clientId, this.selectedFile).subscribe({
      next: () => {
        this.responseMessage = '✅ Client and Docker image uploaded successfully!';
        this.clientForm.reset({ publicClient: true, enabled: true, protocol: 'openid-connect' });
        this.selectedFile = null;
      },
      error: err => {
        console.error('❌ Error uploading:', err);
        this.responseMessage = '❌ Failed to upload client or Docker image.';
      }
    });
  }
}
