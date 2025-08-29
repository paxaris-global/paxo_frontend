import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({  
  selector: 'app-signup-page',
  standalone: true, // <-- Your component is standalone
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // <-- Add HttpClientModule here
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css']
})
export class SignupPage {
  // Your existing code remains the same
  signupForm: FormGroup;
  message = '';
  loading = false;
  products: any[] = [];

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
 ngOnInit() {
    // Load products from central backend
    this.http.get<any[]>('http://localhost:8087/products/data')
      .subscribe({
        next: (res) => this.products = res,
        error: (err) => console.error("❌ Failed to load products", err)
      });
  }

  onSubmit() {
    // ... your existing onSubmit method
    if (this.signupForm.invalid) {
      this.message = '⚠️ Please fill all required fields.';
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

    this.http.post('http://localhost:8082', requestPayload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.message = response;
          this.loading = false;
          this.signupForm.reset({ publicClient: true });
        },
        error: (err) => {
          // console.error(err);
          this.message = '❌ Signup failed. Please check server logs.';
          this.loading = false;
        }
      });
  }
}