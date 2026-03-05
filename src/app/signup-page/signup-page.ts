import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGatewayService } from '../services/api-gateway.service';
import { getStoredRealm } from '../auth-storage';

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

  constructor(
    private fb: FormBuilder,
    private apiGateway: ApiGatewayService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      realmName: [{ value: getStoredRealm() || '', disabled: false }, Validators.required],
      adminPassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.message = '⚠️ Please fill all fields.';
      return;
    }

    this.loading = true;
    const v = this.signupForm.getRawValue();
    const payload = {
      realmName: v.realmName,
      adminPassword: v.adminPassword,
    };

    this.apiGateway.signup(payload as any).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status === 'SUCCESS') {
          this.message = '✅ ' + res.message;
          this.router.navigate(['/dashboard'], {
            queryParams: { realm: payload.realmName },
          });
        } else {
          this.message = '❌ ' + res.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = '❌ ' + (err.error?.message || err.message);
      },
    });
  }
}
