import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPage implements OnInit {

  realms: string[] = [];
  clientIds: string[] = [];

  selectedRealm = '';
  selectedClientId = '';
  username = '';
  password = '';

  loading = false;
  errorMessage = '';
  token = '';

  // ✅ Point this to your API Gateway base URL
  private apiBase = 'http://localhost:8085';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRealms();
  }

  /** Load realms list */
  loadRealms() {
    this.http.get<string[]>(`${this.apiBase}/realms`).subscribe({
      next: (data) => {
        this.realms = data || [];
      },
      error: (err) => {
        console.error('Failed to load realms', err);
        this.errorMessage = '❌ Could not load realms.';
      }
    });
  }

  /** Load clients for selected realm */
  onRealmChange() {
    this.clientIds = [];
    this.selectedClientId = '';
    if (!this.selectedRealm) return;

    this.http.get<string[]>(`${this.apiBase}/${this.selectedRealm}/clients`).subscribe({
      next: (data) => {
        this.clientIds = data || [];
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        this.errorMessage = '❌ Could not load client IDs.';
      }
    });
  }

  /** Login user */
  onLogin() {
    this.errorMessage = '';
    this.token = '';

    if (!this.selectedRealm || !this.selectedClientId || !this.username || !this.password) {
      this.errorMessage = '⚠️ Please fill all fields.';
      return;
    }

    this.loading = true;

    const url = `${this.apiBase}/${this.selectedRealm}/login`;
    const body = {
      username: this.username,
      password: this.password,
      client_id: this.selectedClientId
    };

    this.http.post<any>(url, body).subscribe({
      next: (res) => {
        this.loading = false;

        if (res?.access_token) {
          // ✅ Save token
          this.token = res.access_token;
          localStorage.setItem('access_token', res.access_token);

          
          const redirectUrl = res.url || res.redirect_url || res.redirectTo || res.targetUrl;

          if (redirectUrl) {
            alert('✅ Login successful! Redirecting...');
         
            window.location.href = redirectUrl;
          } else {
            alert('✅ Login successful! But no redirect URL provided.');
          }
        } else {
          this.errorMessage = 'Invalid response from server.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login failed:', err);
        this.errorMessage = err?.error?.message || '❌ Login failed. Check credentials.';
      }
    });
  }
}
