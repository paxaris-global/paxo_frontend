import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // ✅ Needed for formGroup & ngModel
  templateUrl: './user.html',
  styleUrls: ['./user.css'] // ✅ should be styleUrls not styleUrl
})
export class User implements OnInit {
  userForm!: FormGroup;
  roleForm!: FormGroup;
  assignForm!: FormGroup;

  users: any[] = [];
  roles: any[] = [];

  private apiBase = "http://localhost:8087"; 

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // ✅ detect browser/server
  ) {}

  ngOnInit() {
    // ✅ initialize forms
    this.userForm = this.fb.group({
      username: [''],
      email: [''],
      password: ['']
    });

    this.roleForm = this.fb.group({
      roleName: ['']
    });

    this.assignForm = this.fb.group({
      userId: [''],
      roleName: ['']
    });

    this.loadUsers();
    this.loadRoles();
  }

  // ✅ Safe check for SSR
  getAuthHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("access_token");
      if (token) {
        return { headers: new HttpHeaders().set("Authorization", `Bearer ${token}`) };
      }
    }
    return { headers: new HttpHeaders() }; // no token / SSR mode
  }

  createUser() {
    this.http.post(`${this.apiBase}/users`, this.userForm.value, this.getAuthHeaders())
      .subscribe(() => this.loadUsers());
  }

  createRole() {
    this.http.post(`${this.apiBase}/roles`, this.roleForm.value, this.getAuthHeaders())
      .subscribe(() => this.loadRoles());
  }

  assignRole() {
    const { userId, roleName } = this.assignForm.value;
    this.http.post(`${this.apiBase}/users/${userId}/roles/${roleName}`, {}, this.getAuthHeaders())
      .subscribe();
  }

  loadUsers() {
    this.http.get<any[]>(`${this.apiBase}/users`, this.getAuthHeaders())
      .subscribe(data => this.users = data);
  }

  loadRoles() {
    this.http.get<any[]>(`${this.apiBase}/roles`, this.getAuthHeaders())
      .subscribe(data => this.roles = data);
  }
}
