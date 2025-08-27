import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-page',
  standalone: true,                // 👈 ADD THIS
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css']
})
export class SignupPage {
  signupForm: FormGroup;
  message: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.signupForm = this.fb.group({
      realmName: ['', Validators.required],
      clientId: ['', Validators.required],
      publicClient: [true],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.message = 'Please fill all required fields.';
      return;
    }

    this.loading = true;
    const formValue = this.signupForm.value;

    const requestPayload = {
      realmName: formValue.realmName,
      clientId: formValue.clientId,
      publicClient: formValue.publicClient,
      adminUser: {
        username: formValue.username,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        password: formValue.password
      }
    };

    this.http.post('http://localhost:8080/keycloak/signup', requestPayload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.message = response;
          this.loading = false;
          this.signupForm.reset({ publicClient: true });
        },
        error: (err) => {
          console.error(err);
          this.message = 'Signup failed. Please check server logs.';
          this.loading = false;
        }
      });
  }
}
