import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css'],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  message = '';
  loading = false;
  dockerFile?: File;

  constructor(
    private fb: FormBuilder,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      realmName: ['', Validators.required],
      clientId: ['', Validators.required],
      url: ['', Validators.required],
      uri: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onDockerFileSelected(ev: any) {
    this.dockerFile = ev.target.files?.[0];
  }

  onSubmit() {
    if (this.signupForm.invalid || !this.dockerFile) {
      this.message = '⚠️ Please fill all fields and upload ZIP file.';
      return;
    }

    this.loading = true;

    const payload = {
      realmName: this.signupForm.value.realmName,
      clientId: this.signupForm.value.clientId,
      url: this.signupForm.value.url,
      uri: this.signupForm.value.uri,
      publicClient: false,
      adminUser: {
        username: this.signupForm.value.username,
        email: this.signupForm.value.email,
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        password: this.signupForm.value.password
      }
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    formData.append('sourceZip', this.dockerFile);

    this.keycloakService.signup(formData).subscribe({
     next: () => {
        this.loading = false;
        this.message = '✅ Signup completed successfully!';

        this.router.navigate(['/dashboard'], {
          queryParams: { realm: payload.realmName }
        });
      },

      error: err => {
        this.loading = false;
        this.message = '❌ ' + (err.error?.message || err.message);
      }
    });
  }
}
