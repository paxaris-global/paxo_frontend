import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KeycloakService } from '../services/keycloak';

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

  // 🔹 Store token and base_url to display on page
  token: string = '';
  baseUrl: string = '';

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    // Optional: fetch realms for auto-suggestion
    this.keycloakService.getRealms().subscribe({
      next: (data: string[]) => {
        this.realms = data || [];
      },
      error: () => console.warn('❌ Failed to fetch realms for suggestion'),
    });
  }

  /** Perform login */
  login(): void {
    if (!this.selectedRealm || !this.username || !this.password || !this.selectedClientId) {
      this.errorMessage = '❌ All fields are required';
      return;
    }

    this.loading = true;
    this.keycloakService
      .login(this.selectedRealm, this.username, this.password, this.selectedClientId, '')
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.errorMessage = '';

          // 🔹 Backend returns { access_token: '...', base_url: 'http://...' }
          const token = res.access_token;
          const baseUrl = res.base_url;

          if (token) {
            this.token = token;
            this.baseUrl = baseUrl || '';

            // Store token for future API calls
            localStorage.setItem('access_token', token);
            localStorage.setItem('token', token);
            
            if (baseUrl) {
              localStorage.setItem('base_url', baseUrl);
            }

            // Redirect to dashboard
            window.location.href = `/dashboard?realm=${this.selectedRealm}`;
          } else {
            this.errorMessage = 'Login successful but no token received';
          }
        },
        error: (err: any) => {
          this.loading = false;
          const errorMsg = err.error?.message || err.error?.error || err.message || 'Login failed. Please check your credentials.';
          this.errorMessage = errorMsg;
          console.error('Login error:', err);
        },
      });
  }
}
