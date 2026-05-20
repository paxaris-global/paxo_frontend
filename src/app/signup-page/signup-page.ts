import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiGatewayService } from '../services/api-gateway.service';
import {
  getStoredRealm,
  setStoredClientId,
  setStoredRealm,
  touchStoredLastActivity,
} from '../auth-storage';
import { LoginResponse } from '../models';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup-page.html',
  styleUrls: ['./signup-page.css'],
})
export class SignupPage implements OnInit {
  private static readonly DEFAULT_ADMIN_USERNAME = 'admin';

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
        if (res.status === 'SUCCESS') {
          this.message = '✅ ' + res.message + ' Signing you in...';
          setStoredRealm(payload.realmName);
          const clientId = `${payload.realmName}-admin-product`;
          setStoredClientId(clientId);
          this.apiGateway.login(payload.realmName, {
            username: SignupPage.DEFAULT_ADMIN_USERNAME,
            password: payload.adminPassword,
            client_id: clientId,
          }).subscribe({
            next: (_loginRes: LoginResponse) => {
              this.loading = false;
              touchStoredLastActivity();
              void this.router.navigateByUrl('/dashboard/product/products');
            },
            error: () => {
              this.loading = false;
              this.message =
                '✅ Signup completed. Auto-login failed, please log in once to continue.';
              void this.router.navigate(['/login'], {
                queryParams: { realm: payload.realmName },
              });
            },
          });
        } else {
          this.loading = false;
          this.message = '❌ ' + res.message;
        }
      },
      error: (err: unknown) => {
        this.loading = false;
        if (err instanceof HttpErrorResponse && err.status === 0) {
          this.message =
            '❌ Cannot reach the API. Run paxo/scripts/start-local-access.sh (port-forward), then try again.';
        } else if (err instanceof HttpErrorResponse) {
          const body = err.error as { message?: string } | undefined;
          this.message = '❌ ' + (body?.message || err.message);
        } else {
          this.message = '❌ ' + (err instanceof Error ? err.message : 'Signup failed.');
        }
      },
    });
  }
}
