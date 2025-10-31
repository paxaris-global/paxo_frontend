import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';

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

  private apiBase = 'http://localhost:8085/keycloak';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.clientForm = this.fb.group({
      clientId: [''],
      publicClient: [{ value: true, disabled: true }],
      enabled: [{ value: true, disabled: true }],
      protocol: [{ value: 'openid-connect', disabled: true }]
    });
  }

  getAuthHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      if (token) {
        return {
          headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        };
      }
    }
    return {};
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Selected Docker file:', file.name);
    }
  }

  createClient() {
    if (!this.selectedFile) {
      this.responseMessage = '⚠️ Please select a Docker image file.';
      return;
    }

    const realm = 'myrealmVipTest';
    const url = `${this.apiBase}/${realm}/clients/upload`;

    const formData = new FormData();
    formData.append('clientId', this.clientForm.getRawValue().clientId);
    formData.append('publicClient', 'true');
    formData.append('enabled', 'true');
    formData.append('protocol', 'openid-connect');
    formData.append('dockerImage', this.selectedFile);

    this.http.post(url, formData, this.getAuthHeaders()).subscribe({
      next: () => {
        this.responseMessage = '✅ Client and Docker image uploaded successfully!';
        this.clientForm.reset({ publicClient: true, enabled: true, protocol: 'openid-connect' });
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('❌ Error uploading:', err);
        this.responseMessage = '❌ Failed to upload client or Docker image.';
      }
    });
  }
}
