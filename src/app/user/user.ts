import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeycloakService } from '../services/keycloak';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User {
  users: any[] = [];
  roles: any[] = [];
  clients: any[] = [];

  activeSection: 'users' | 'roles' | 'assign' = 'users';
  userForm: FormGroup;
  roleForm: FormGroup;
  assignForm: FormGroup;

  constructor(private keycloakService: KeycloakService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.roleForm = this.fb.group({
      client: ['', Validators.required],
      roleName: ['', Validators.required],
      description: [''],
      url: [''],
      uri: [''],
    });

    this.assignForm = this.fb.group({
      userId: ['', Validators.required],
      client: ['', Validators.required],
      roleName: ['', Validators.required],
    });

    this.loadUsers();
    this.loadClients();
    this.loadRoles();
  }

  setSection(section: 'users' | 'roles' | 'assign') {
    this.activeSection = section;
  }

  loadUsers(): void {
    this.keycloakService.getUsers().subscribe({
      next: (data: any[]) => (this.users = data || []),
      error: (err: any) => console.error('Error loading users:', err),
    });
  }

  loadRoles(): void {
    this.keycloakService.getRoles().subscribe({
      next: (data: any[]) => (this.roles = data || []),
      error: (err: any) => console.error('Error loading roles:', err),
    });
  }

  loadClients(): void {
    this.keycloakService.getClients().subscribe({
      next: (data: any[]) => (this.clients = data || []),
      error: (err: any) => console.error('Error loading clients:', err),
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.keycloakService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.loadUsers();
          this.userForm.reset();
        },
        error: (err: any) => console.error('❌ Failed to create user', err),
      });
    }
  }

  createRole(): void {
    if (this.roleForm.valid) {
      const { client, ...payload } = this.roleForm.value;
      this.keycloakService.createRole(client, payload).subscribe({
        next: () => {
          this.loadRoles();
          this.roleForm.reset();
        },
        error: (err: any) => console.error('❌ Failed to create role', err),
      });
    }
  }

  assignRole(): void {
    if (this.assignForm.valid) {
      const { userId, client, roleName } = this.assignForm.value;
      this.keycloakService.assignRole(userId, client, roleName).subscribe({
        next: () => {
          console.log('✅ Role assigned');
          this.assignForm.reset();
        },
        error: (err: any) => console.error(err),
      });
    }
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
