import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { CreateClientComponent } from '../create-client/create-client';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CreateClientComponent],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User implements OnInit {
  userForm!: FormGroup;
  roleForm!: FormGroup;
  assignForm!: FormGroup;

  users: any[] = [];
  roles: any[] = [];
  clients: any[] = [];

  activeSection: string = 'users'; // Default section
  private apiBase = 'http://localhost:8085/keycloak/myrealmVipTest';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      username: [''],
      email: [''],
      firstName: [''],
      lastName: [''],
      password: ['']
    });

    this.roleForm = this.fb.group({
      client: [''],
      roleName: [''],
      description: [''],
      url: [''],
      uri: ['']
    });

    this.assignForm = this.fb.group({
      userId: [''],
      client: [''],
      roleName: ['']
    });

    this.loadClients();
    this.loadUsers();
    this.loadRoles();
  }

  // Sidebar switch
  setSection(section: string) {
    this.activeSection = section;
  }

  // Get auth headers
  getAuthHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      if (token) {
        return {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        };
      }
    }
    return {};
  }

  // ✅ Create User (using real Keycloak API)
  createUser() {
    const payload = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: this.userForm.value.password,
          temporary: false
        }
      ]
    };

    this.http.post(`${this.apiBase}/users`, payload, this.getAuthHeaders()).subscribe({
      next: () => {
        alert('✅ User created successfully!');
        this.loadUsers();
        this.userForm.reset();
      },
      error: (err) => {
        console.error('❌ Failed to create user', err);
        alert('❌ Failed to create user — check console.');
      }
    });
  }

  // ✅ Create Role (with client selection)
  createRole() {
    const payload = [
      {
        name: this.roleForm.value.roleName,
        description: this.roleForm.value.description,
        url: this.roleForm.value.url,
        uri: this.roleForm.value.uri
      }
    ];

    const client = this.roleForm.value.client;
    if (!client) {
      alert('⚠️ Please select a client before creating a role.');
      return;
    }

    this.http.post(`${this.apiBase}/clients/${client}/roles`, payload, this.getAuthHeaders()).subscribe({
      next: () => {
        alert(`✅ Role created successfully for client "${client}"`);
        this.loadRoles();
        this.roleForm.reset();
      },
      error: (err) => {
        console.error('❌ Failed to create role', err);
        alert('❌ Failed to create role — check console.');
      }
    });
  }

  // ✅ Assign Role to User
  assignRole() {
    const { userId, client, roleName } = this.assignForm.value;
    if (!userId || !client || !roleName) {
      alert('⚠️ Please select user, client, and role.');
      return;
    }

    this.http.post(
      `${this.apiBase}/users/${userId}/clients/${client}/roles?roleName=${roleName}`,
      {},
      this.getAuthHeaders()
    ).subscribe({
      next: () => alert('✅ Role assigned successfully'),
      error: (err) => console.error('❌ Failed to assign role', err)
    });
  }

  // ✅ Load all clients
  loadClients() {
    this.http.get<any[]>(`${this.apiBase}/clients`, this.getAuthHeaders()).subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('❌ Failed to load clients', err)
    });
  }

  // ✅ Load all users
  loadUsers() {
    this.http.get<any[]>(`${this.apiBase}/users`, this.getAuthHeaders()).subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('❌ Failed to load users', err)
    });
  }

  // ✅ Load all roles (for all clients)
  loadRoles() {
    this.http.get<any[]>(`${this.apiBase}/clients`, this.getAuthHeaders()).subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('❌ Failed to load roles', err)
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
  }
}
