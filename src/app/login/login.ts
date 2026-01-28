import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from '../services/keycloak';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

          if (token && baseUrl) {
            this.token = token; // 🔹 store for UI display
            this.baseUrl = baseUrl; // 🔹 store for UI display

            console.log('🔐 Token received:', token);
            console.log('🌐 Base URL received:', baseUrl);

            // Store token for future API calls
            localStorage.setItem('access_token', token);

            // Optional: store base_url for future API calls
            localStorage.setItem('base_url', baseUrl);

            // Optional: redirect automatically to base_url
            // window.location.href = baseUrl;
          } else {
            this.errorMessage = '⚠️ Login successful but no base URL provided';
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = '❌ Login failed';
          console.error(err);
        },
      });
  }
}
