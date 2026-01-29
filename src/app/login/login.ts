import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiGatewayService } from '../services/api-gateway.service';
import { LoginRequest, LoginResponse } from '../models';
import { getStoredRealm } from '../auth-storage';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginPage implements OnInit {
  realms: string[] = [];
  selectedRealm: string = '';
  selectedClientId: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  token: string = '';
  baseUrl: string = '';

  constructor(private apiGateway: ApiGatewayService) {}

  ngOnInit(): void {
    this.selectedRealm = getStoredRealm() || '';
  }

  login(): void {
    if (!this.selectedRealm || !this.username || !this.password || !this.selectedClientId) {
      this.errorMessage = '❌ All fields are required';
      return;
    }

    this.loading = true;
    const body: LoginRequest = {
      username: this.username,
      password: this.password,
      client_id: this.selectedClientId,
    };

    this.apiGateway.login(this.selectedRealm, body).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;
        this.errorMessage = '';
        const token = res.access_token;
        const baseUrl = res.base_url;

        if (token) {
          this.token = token;
          this.baseUrl = baseUrl || '';
          if (baseUrl && typeof window !== 'undefined') {
            window.localStorage.setItem('base_url', baseUrl);
          }
          window.location.href = `/dashboard?realm=${this.selectedRealm}`;
        } else {
          this.errorMessage = 'Login successful but no token received';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || err.error?.error || err.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      },
    });
  }
}
