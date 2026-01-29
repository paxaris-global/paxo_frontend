import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { KeycloakService } from '../services/keycloak';
import { ApiGatewayService } from '../services/api-gateway.service';
import { UserCreationRequest, AssignRolePayload } from '../models';
import { getStoredToken, getStoredRealm } from '../auth-storage';
import { Subscription } from 'rxjs';
import { UsersTabComponent } from './users-tab/users-tab.component';
import { RolesTabComponent } from './roles-tab/roles-tab.component';
import { AssignRoleTabComponent } from './assign-role-tab/assign-role-tab.component';

interface UrlUriPair {
  url: string;
  uri: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersTabComponent,
    RolesTabComponent,
    AssignRoleTabComponent,
  ],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit, OnDestroy {
  users: any[] = [];
  roles: any[] = [];
  clients: any[] = [];
  realms: string[] = [];
  currentRealm: string = '';
  currentProduct: string = '';

  activeSection: 'users' | 'roles' | 'assign' | 'test' = 'users';
  showTabs = true;
  private clientChangesSub: Subscription | null = null;
  private routeDataSub: Subscription | null = null;
  userForm: FormGroup;
  roleForm: FormGroup;
  assignForm: FormGroup;
  testAccessForm: FormGroup;

  // Test Access
  testingAccess: boolean = false;
  testResult: any = null;
  currentToken: string | null = null;
  tokenInfo: any = null;

  // OpenAPI Spec
  openApiFile: File | null = null;
  openApiEndpoints: Array<{
    method: string;
    path: string;
    summary?: string;
    description?: string;
    selected: boolean;
  }> = [];
  openApiBaseUrl: string = '';

  private _initialLoadDone = false;

  constructor(
    private keycloakService: KeycloakService,
    private apiGateway: ApiGatewayService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.roleForm = this.fb.group({
      realm: [getStoredRealm() || '', Validators.required],
      client: ['', Validators.required],
      roleName: ['', Validators.required],
      description: [''],
      urlUriPairs: this.fb.array([this.createUrlUriPair()]), // Start with one pair
    });

    this.assignForm = this.fb.group({
      userId: ['', Validators.required],
      client: ['', Validators.required],
      roleName: ['', Validators.required],
    });

    this.testAccessForm = this.fb.group({
      testUrl: ['', Validators.required],
      httpMethod: ['GET'],
      makeActualRequest: [false],
    });
  }

  ngOnInit(): void {
    const token = getStoredToken();
    if (token) {
      this.currentToken = token;
      this.getRealmAndProductFromToken(token);
      this.loadTokenInfo(token);
    }
    const storedRealm = getStoredRealm();
    if (storedRealm) {
      if (!this.currentRealm) this.currentRealm = storedRealm;
      if (!this.roleForm.get('realm')?.value) this.roleForm.patchValue({ realm: storedRealm });
    }
    this.roleForm.get('realm')?.disable();

    const realm = this.currentRealm || this.roleForm.get('realm')?.value;
    if (realm && !this._initialLoadDone) {
      this._initialLoadDone = true;
      this.loadUsers();
      this.loadClients();
      this.loadRoles();
    }

    const sub = this.roleForm.get('client')?.valueChanges?.subscribe(() => this.loadRoles());
    if (sub) this.clientChangesSub = sub;

    this.routeDataSub = this.route.data.subscribe((d) => {
      const section = d['section'];
      if (section === 'users' || section === 'roles' || section === 'assign') {
        this.activeSection = section;
        this.showTabs = false;
        if (section === 'roles') {
          const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
          if (realm && this.clients.length > 0 && !this.roleForm.get('client')?.value) {
            this.roleForm.patchValue({ client: this.clients[0] });
          }
          this.loadRoles();
        }
      } else {
        this.showTabs = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.clientChangesSub?.unsubscribe();
    this.routeDataSub?.unsubscribe();
  }

  // Get URL/URI pairs FormArray
  get urlUriPairs(): FormArray {
    return this.roleForm.get('urlUriPairs') as FormArray;
  }

  // Create a new URL/URI pair form group
  createUrlUriPair(): FormGroup {
    return this.fb.group({
      url: ['', Validators.required],
      uri: ['', Validators.required],
    });
  }

  // Add a new URL/URI pair
  addUrlUriPair(): void {
    this.urlUriPairs.push(this.createUrlUriPair());
  }

  // Remove a URL/URI pair
  removeUrlUriPair(index: number): void {
    if (this.urlUriPairs.length > 1) {
      this.urlUriPairs.removeAt(index);
    }
  }

  // Get realm and product from token
  getRealmAndProductFromToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentRealm = payload.realm || payload.iss?.split('/realms/')[1] || '';
      this.currentProduct = payload.product || payload.azp || '';
      
      // Set default values in form
      if (this.currentRealm) {
        this.roleForm.patchValue({ realm: this.currentRealm });
      }
    } catch (e) {
      console.warn('Could not extract realm/product from token');
    }
  }

  setSection(section: 'users' | 'roles' | 'assign' | 'test') {
    this.activeSection = section;
    if (section === 'roles') {
      const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
      if (realm && this.clients.length > 0 && !this.roleForm.get('client')?.value) {
        this.roleForm.patchValue({ client: this.clients[0] });
      }
      this.loadRoles();
    }
    if (section === 'test') {
      const token = getStoredToken();
      if (token) {
        this.currentToken = token;
        this.loadTokenInfo(token);
      }
    }
  }

  loadUsers(): void {
    const realm = this.currentRealm || this.roleForm.get('realm')?.value;
    if (!realm) {
      console.warn('Cannot load users: realm not specified');
      return;
    }
    this.apiGateway.getUsers(realm).subscribe({
      next: (data: any[]) => (this.users = data || []),
      error: (err: any) => console.error('Error loading users:', err),
    });
  }

  loadRoles(): void {
    const raw = this.roleForm.getRawValue();
    const realm = this.currentRealm || raw?.realm;
    const client = raw?.client ?? this.roleForm.get('client')?.value;
    if (!realm || !client) {
      this.roles = [];
      return;
    }
    this.apiGateway.getRoles(realm, client).subscribe({
      next: (data: any[]) => {
        this.roles = (data || []).map((r) => ({ ...r, client }));
      },
      error: (err: any) => {
        console.error('Error loading roles:', err);
        this.roles = [];
      },
    });
  }

  loadClients(): void {
    const realm = this.currentRealm || this.roleForm.get('realm')?.value;
    if (!realm) return;
    this.apiGateway.getClients(realm).subscribe({
      next: (data) => {
        this.clients = (data || []).map((c) => c.clientId ?? c['id'] ?? '').filter(Boolean);
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.clients = [];
      },
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      const realm = this.currentRealm || this.roleForm.get('realm')?.value;
      if (!realm) {
        alert('Please select a realm first');
        return;
      }
      const body: UserCreationRequest = {
        username: this.userForm.value.username,
        email: this.userForm.value.email,
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        enabled: true,
        emailVerified: true,
        credentials: [{ type: 'password', value: this.userForm.value.password, temporary: false }],
      };
      this.apiGateway.createUser(realm, body).subscribe({
        next: () => {
          alert('✅ User created successfully');
          this.loadUsers();
          this.userForm.reset();
        },
        error: (err: any) => {
          console.error('❌ Failed to create user', err);
          alert('Failed to create user: ' + (err.error?.message || err.message || 'Unknown error'));
        },
      });
    }
  }

  createRole(): void {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.getRawValue();
      const realm = formValue.realm || this.currentRealm;
      const client = formValue.client;
      const roleName = formValue.roleName;
      const description = formValue.description || '';
      const urlUriPairs = formValue.urlUriPairs.filter((pair: UrlUriPair) => pair.url && pair.uri);

      if (!realm || !client || !roleName) {
        console.error('❌ Missing required fields: realm, client, or roleName');
        return;
      }

      if (urlUriPairs.length === 0) {
        console.error('❌ At least one URL/URI pair is required');
        return;
      }

      // Create role with multiple URL/URI pairs
      this.keycloakService.createRoleWithUrls(
        realm,
        client,
        roleName,
        description,
        urlUriPairs
      ).subscribe({
        next: () => {
          const message = `✅ Role "${roleName}" created successfully with ${urlUriPairs.length} URL/URI pair(s)`;
          console.log(message);
          alert(message);
          this.loadRoles();
          // Reset form but keep one URL/URI pair
          this.roleForm.reset();
          this.urlUriPairs.clear();
          this.urlUriPairs.push(this.createUrlUriPair());
          if (realm) {
            this.roleForm.patchValue({ realm: realm });
          }
        },
        error: (err: any) => {
          console.error('❌ Failed to create role', err);
          const errorMessage = err.error?.message || err.message || err.error || 'Unknown error';
          alert('Failed to create role: ' + errorMessage);
        },
      });
    } else {
      console.error('❌ Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.roleForm.controls).forEach(key => {
        this.roleForm.get(key)?.markAsTouched();
      });
      this.urlUriPairs.controls.forEach(control => {
        control.markAllAsTouched();
      });
    }
  }

  assignRole(): void {
    if (this.assignForm.valid) {
      const realm = this.currentRealm || this.roleForm.get('realm')?.value;
      if (!realm) {
        alert('Please select a realm first');
        return;
      }
      const { userId, client, roleName } = this.assignForm.value;
      const user = this.users.find((u) => u.id === userId);
      if (!user || !user.username) {
        alert('User not found or username missing');
        return;
      }
      const body: AssignRolePayload = [{ name: roleName }];
      this.apiGateway.assignRoleToUser(realm, user.username, client, body).subscribe({
        next: () => {
          alert('✅ Role assigned successfully');
          this.assignForm.reset();
        },
        error: (err: any) => {
          console.error('❌ Failed to assign role', err);
          alert('Failed to assign role: ' + (err.error?.message || err.message || 'Unknown error'));
        },
      });
    }
  }

  logout(): void {
    this.keycloakService.logout();
  }

  // Test Access Methods
  loadTokenInfo(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.tokenInfo = {
        realm: payload.realm || payload.iss?.split('/realms/')[1] || '',
        product: payload.product || payload.azp || '',
        roles: this.extractRolesFromToken(payload)
      };
    } catch (e) {
      console.warn('Could not extract token info');
      this.tokenInfo = null;
    }
  }

  extractRolesFromToken(payload: any): string[] {
    const roles: string[] = [];
    
    // Extract realm roles
    if (payload.realm_access?.roles) {
      roles.push(...payload.realm_access.roles);
    }
    
    // Extract client roles
    if (payload.resource_access) {
      Object.keys(payload.resource_access).forEach(clientId => {
        const clientRoles = payload.resource_access[clientId]?.roles;
        if (clientRoles && Array.isArray(clientRoles)) {
          roles.push(...clientRoles);
        }
      });
    }
    
    return [...new Set(roles)]; // Remove duplicates
  }

  testAccess(): void {
    if (this.testAccessForm.invalid) {
      return;
    }

    const token = getStoredToken();
    if (!token) {
      alert('No authentication token found. Please login first.');
      return;
    }

    this.testingAccess = true;
    this.testResult = null;

    const testUrl = this.testAccessForm.value.testUrl;
    const method = this.testAccessForm.value.httpMethod;
    const makeActualRequest = this.testAccessForm.value.makeActualRequest;

    if (makeActualRequest) {
      this.makeActualHttpRequest(token, testUrl, method);
    } else {
      this.apiGateway.validateAccess(token, testUrl).subscribe({
        next: (response: any) => {
          this.testingAccess = false;
          
          // Handle both boolean and object responses
          const isAllowed = typeof response === 'boolean' ? response : response.allowed || response;
          
          this.testResult = {
            allowed: isAllowed,
            testedUrl: testUrl,
            method: method,
            userRoles: this.tokenInfo?.roles || [],
            matchedRole: response.matchedRole || null,
            allowedUrls: response.allowedUrls || [],
            message: response.message || (isAllowed ? 'You have access to this URL/URI' : 'You do not have access to this URL/URI'),
            responseData: response.responseData || null,
            statusCode: response.statusCode || null
          };
        },
        error: (err: any) => {
          this.testingAccess = false;
          console.error('❌ Error testing access', err);
          this.testResult = {
            allowed: false,
            testedUrl: testUrl,
            method: method,
            userRoles: this.tokenInfo?.roles || [],
            message: 'Error testing access: ' + (err.error?.message || err.message || 'Unknown error'),
            error: err
          };
        }
      });
    }
  }

  makeActualHttpRequest(token: string, url: string, method: string): void {
    this.keycloakService.makeHttpRequest(token, url, method).subscribe({
      next: (response: any) => {
        this.testingAccess = false;
        this.testResult = {
          allowed: true,
          testedUrl: url,
          method: method,
          userRoles: this.tokenInfo?.roles || [],
          message: `✅ Successfully accessed ${url} via ${method}`,
          responseData: response.data || response,
          statusCode: response.statusCode || 200,
          actualRequest: true
        };
      },
      error: (err: any) => {
        this.testingAccess = false;
        const statusCode = err.status || err.statusCode || 0;
        const isAccessDenied = statusCode === 403 || statusCode === 401;
        
        this.testResult = {
          allowed: false,
          testedUrl: url,
          method: method,
          userRoles: this.tokenInfo?.roles || [],
          message: isAccessDenied 
            ? `❌ Access Denied (${statusCode})` 
            : `❌ Request Failed: ${err.error?.message || err.message || 'Unknown error'} (${statusCode})`,
          statusCode: statusCode,
          error: err.error || err.message,
          actualRequest: true
        };
      }
    });
  }

  clearTestResult(): void {
    this.testResult = null;
  }

  // OpenAPI Spec Methods
  onOpenApiFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.openApiFile = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const content = e.target.result;
        let spec: any;

        // Parse JSON or YAML
        if (file.name.endsWith('.json')) {
          spec = JSON.parse(content);
        } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
          // For YAML, we'll need a YAML parser, but for now try JSON.parse if it's actually JSON
          // In production, you'd want to use a YAML parser library
          try {
            spec = JSON.parse(content);
          } catch {
            alert('YAML parsing not fully supported. Please use JSON format or install a YAML parser.');
            return;
          }
        } else {
          alert('Unsupported file format. Please use .json or .yaml/.yml');
          return;
        }

        this.parseOpenApiSpec(spec);
      } catch (error: any) {
        console.error('Error parsing OpenAPI spec:', error);
        alert('Error parsing OpenAPI spec: ' + error.message);
      }
    };

    reader.readAsText(file);
  }

  parseOpenApiSpec(spec: any): void {
    this.openApiEndpoints = [];
    
    // Extract base URL/server URL
    if (spec.servers && spec.servers.length > 0) {
      this.openApiBaseUrl = spec.servers[0].url || '';
    } else if (spec.host) {
      const scheme = spec.schemes?.[0] || 'https';
      this.openApiBaseUrl = `${scheme}://${spec.host}${spec.basePath || ''}`;
    }

    // Extract paths and operations
    if (!spec.paths) {
      alert('No paths found in OpenAPI spec');
      return;
    }

    const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
    
    Object.keys(spec.paths).forEach((path: string) => {
      const pathItem = spec.paths[path];
      
      httpMethods.forEach((method: string) => {
        if (pathItem[method]) {
          const operation = pathItem[method];
          this.openApiEndpoints.push({
            method: method.toUpperCase(),
            path: path,
            summary: operation.summary,
            description: operation.description,
            selected: true // Select all by default
          });
        }
      });
    });

    if (this.openApiEndpoints.length === 0) {
      alert('No endpoints found in OpenAPI spec');
    } else {
      // Prompt for base URL if not found in spec
      if (!this.openApiBaseUrl) {
        const userUrl = prompt('Enter the base URL for these endpoints (e.g., http://localhost:8083):');
        if (userUrl) {
          this.openApiBaseUrl = userUrl;
        }
      }
    }
  }

  toggleEndpointSelection(index: number): void {
    this.openApiEndpoints[index].selected = !this.openApiEndpoints[index].selected;
  }

  selectAllEndpoints(): void {
    this.openApiEndpoints.forEach(endpoint => endpoint.selected = true);
  }

  deselectAllEndpoints(): void {
    this.openApiEndpoints.forEach(endpoint => endpoint.selected = false);
  }

  loadSelectedEndpointsToForm(): void {
    const selectedEndpoints = this.openApiEndpoints.filter(e => e.selected);
    
    if (selectedEndpoints.length === 0) {
      alert('Please select at least one endpoint');
      return;
    }

    if (!this.openApiBaseUrl) {
      alert('Base URL is required. Please enter it when prompted or ensure it\'s in the OpenAPI spec.');
      return;
    }

    // Group endpoints by path (to create one URL/URI pair per unique path)
    const pathGroups = new Map<string, string[]>();
    
    selectedEndpoints.forEach(endpoint => {
      if (!pathGroups.has(endpoint.path)) {
        pathGroups.set(endpoint.path, []);
      }
      pathGroups.get(endpoint.path)!.push(endpoint.method);
    });

    // Clear existing URL/URI pairs
    this.urlUriPairs.clear();

    // Add URL/URI pairs for each unique path
    pathGroups.forEach((methods, path) => {
      const urlUriPair = this.createUrlUriPair();
      urlUriPair.patchValue({
        url: this.openApiBaseUrl,
        uri: path
      });
      this.urlUriPairs.push(urlUriPair);
    });

    alert(`✅ Loaded ${pathGroups.size} URL/URI pair(s) from OpenAPI spec`);
  }

  clearOpenApiData(): void {
    this.openApiFile = null;
    this.openApiEndpoints = [];
    this.openApiBaseUrl = '';
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
