import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css']
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  message = '';
  loading = false;
  dockerFile: File | null = null;
  dockerFolderFiles: File[] = [];
  dockerFileName = '';

  private apiBase = 'http://localhost:8085/identity-service';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      realmName: ['', Validators.required],
      clientId: ['', Validators.required], // changed to required text input
      publicClient: [true],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  onDockerFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.dockerFile = file;
      this.dockerFileName = file.name;
    }
  }

  onDockerFolderSelected(event: any) {
    const files = Array.from(event.target.files);
    this.dockerFolderFiles = files as File[];
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.message = '⚠️ Please fill all required fields.';
      return;
    }

    this.loading = true;
    const formValue = this.signupForm.value;
    const formData = new FormData();

    formData.append('realmName', formValue.realmName);
    formData.append('clientId', formValue.clientId);
    formData.append('publicClient', formValue.publicClient);
    formData.append('username', formValue.username);
    formData.append('email', formValue.email);
    formData.append('firstName', formValue.firstName);
    formData.append('lastName', formValue.lastName);
    formData.append('password', formValue.password);

    if (this.dockerFile) {
      formData.append('dockerImage', this.dockerFile);
    }

    if (this.dockerFolderFiles.length > 0) {
      this.dockerFolderFiles.forEach((file) => {
        formData.append('dockerFolder', file, file.webkitRelativePath);
      });
    }

    this.http.post(`${this.apiBase}/signup`, formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        const token = response?.access_token || response?.token;

        if (token) {
          localStorage.setItem('access_token', token);
          this.message = '✅ Signup successful. Redirecting...';

          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
        } else {
          this.message = '⚠️ Signup success, but no token received.';
        }

        this.signupForm.reset({ publicClient: true });
        this.dockerFile = null;
        this.dockerFileName = '';
        this.dockerFolderFiles = [];
      },
      error: (err) => {
        console.error(err);
        this.message = '❌ Signup failed. Check server logs.';
        this.loading = false;
      }
    });
  }
}
