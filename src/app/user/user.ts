import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { KeycloakService } from '../services/keycloak';
import { ApiGatewayService } from '../services/api-gateway.service';
import { UserCreationRequest, ProductOption, productRowToOption } from '../models';
import { getStoredToken, getStoredRealm } from '../auth-storage';
import { Subscription, filter } from 'rxjs';
import * as yaml from 'js-yaml';
import {
  endpointsToRoleUrlPayload,
  extractOpenApiBaseUrl,
  parseOpenApiToEndpoints,
} from './open-api-spec.util';
import { UsersTabComponent } from './users-tab/users-tab.component';
import { RolesTabComponent } from './roles-tab/roles-tab.component';
import { RoleUrlTabComponent } from './roles-urls-tab/role-url-tab';
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
    RoleUrlTabComponent,
    AssignRoleTabComponent
  ],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit, OnDestroy {
  users: any[] = [];
  roles: any[] = [];
  products: ProductOption[] = [];
  realms: string[] = [];
  editingUsername: string | null = null;
  currentRealm: string = '';
  currentProduct: string = '';
  showEditModal: boolean = false;

  activeSection: 'users' | 'roles' | 'roleUrl' | 'assign' | 'test' | 'products' = 'users';
  showTabs = true;
  private productChangesSub: Subscription | null = null;
  private assignProductSub: Subscription | null = null;
  private routeDataSub: Subscription | null = null;
  private routeEventSub: Subscription | null = null;
  private routeQuerySub: Subscription | null = null;
  private productsRequestSeq = 0;
  private rolesRequestSeq = 0;
  userForm: FormGroup;
  roleForm: FormGroup;
  assignForm: FormGroup;
  testAccessForm: FormGroup;
  productForm: FormGroup;

  // Test Access
  testingAccess: boolean = false;
  testResult: any = null;
  currentToken: string | null = null;
  tokenInfo: any = null;

  // OpenAPI Specs
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
    private route: ActivatedRoute,
    private router: Router
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
      client: [''],
      product: ['', Validators.required],
      roleName: ['', Validators.required],
      description: [''],
      selectedRole: ['', Validators.required],
      urlUriPairs: this.fb.array([this.createUrlUriPair()]),
    });


    this.assignForm = this.fb.group({
      userId: ['', Validators.required],
      product: ['', Validators.required],
      roleName: [[], Validators.required],
    });

    this.testAccessForm = this.fb.group({
      testUrl: ['', Validators.required],
      httpMethod: ['GET'],
      makeActualRequest: [false],
    });

    this.productForm = this.fb.group({
      clientId: ['', Validators.required],
      rootUrl: [''],
      redirectUris: ['*'],
      webOrigins: ['*'],
      publicClient: [true]
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
      this.loadProducts();
      this.loadRoles();
    }



 this.productChangesSub = this.roleForm.get('product')!.valueChanges.subscribe((product: string | null) => {
  if (!product) {
    if (this.activeSection === 'roles' || this.activeSection === 'roleUrl') {
      this.roles = [];
    }
    return;
  }

  if (this.activeSection === 'roles' || this.activeSection === 'roleUrl') {
    this.loadRolesForProduct(product);
  }
  this.urlUriPairs.clear();
  this.urlUriPairs.push(this.createUrlUriPair());
});

this.assignProductSub = this.assignForm.get('product')!.valueChanges.subscribe((product: string | null) => {
  this.assignForm.patchValue({ roleName: [] }, { emitEvent: false });
  if (!product) {
    if (this.activeSection === 'assign') {
      this.roles = [];
    }
    return;
  }

  if (this.activeSection === 'assign') {
    this.loadRolesForProduct(product);
  }
});




this.syncSectionFromRoute();

this.routeDataSub = this.route.data.subscribe(() => {
  this.syncSectionFromRoute();
});

this.routeQuerySub = this.route.queryParamMap.subscribe((params) => {
  const realm = params.get('realm');
  if (realm && !this.currentRealm) {
    this.currentRealm = realm;
    this.roleForm.patchValue({ realm });
    this.loadUsers();
    this.loadProducts();
  } else if (realm && realm === this.currentRealm && !this.products.length) {
    this.loadProducts();
  }

  const section = params.get('section');
  if (section === 'users' || section === 'roles' || section === 'roleUrl' || section === 'assign') {
    this.activeSection = section;
    this.ensureDataForActiveSection();
  }
});

this.routeEventSub = this.router.events
  .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
  .subscribe(() => {
    this.syncSectionFromRoute();
  });

  }

  ngOnDestroy(): void {
    this.productChangesSub?.unsubscribe();
    this.assignProductSub?.unsubscribe();
    this.routeDataSub?.unsubscribe();
    this.routeEventSub?.unsubscribe();
    this.routeQuerySub?.unsubscribe();
  }

  private syncSectionFromRoute(): void {
    const path = this.currentSectionFromUrl;

    if (path === 'users') {
      this.activeSection = 'users';
    } else if (path === 'roles') {
      this.activeSection = 'roles';
    } else if (path === 'roleUrl') {
      this.activeSection = 'roleUrl';
    } else if (path === 'assign-roles') {
      this.activeSection = 'assign';
    } else {
      const section = this.route.snapshot.data?.['section'];
      if (section === 'users' || section === 'roles' || section === 'roleUrl' || section === 'assign') {
        this.activeSection = section;
      } else {
        this.activeSection = 'users';
      }
    }

    this.showTabs = true;

    this.ensureDataForActiveSection();
  }

  private ensureDataForActiveSection(): void {
    if (this.activeSection === 'users') {
      this.loadUsers();
      return;
    }

    if (this.activeSection === 'roles' || this.activeSection === 'roleUrl') {
      this.ensureProductSelectedAndRolesLoaded('roleForm');
      return;
    }

    if (this.activeSection === 'assign') {
      this.loadUsers();
      this.ensureProductSelectedAndRolesLoaded('assignForm');
    }
  }

  private ensureProductSelectedAndRolesLoaded(formName: 'roleForm' | 'assignForm'): void {
    const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
    if (!realm) return;

    if (!this.products.length) {
      this.loadProducts();
      return;
    }

    const form = formName === 'roleForm' ? this.roleForm : this.assignForm;
    const selectedProduct = form.get('product')?.value;
    const selectedExists = this.products.some((product) => product.clientId === selectedProduct);
    if (!selectedProduct || !selectedExists) {
      form.patchValue({ product: this.products[0].clientId });
      return;
    }

    this.loadRolesForProduct(selectedProduct);
  }

  get currentSectionFromUrl(): 'users' | 'roles' | 'roleUrl' | 'assign-roles' | '' {
    const cleanUrl = this.router.url.split('?')[0].split('#')[0];
    const path = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);
    if (path === 'users' || path === 'roles' || path === 'roleUrl' || path === 'assign-roles') {
      return path;
    }
    return '';
  }

  // Get URL/URI pairs FormArray
  get urlUriPairs(): FormArray {
    return this.roleForm.get('urlUriPairs') as FormArray;
  }

  get selectedRoleNames(): string[] {
    return this.assignForm.get('roleName')?.value || [];
  }

  get availableRolesForAssignment(): any[] {
    const selected = this.selectedRoleNames;
    return this.roles.filter(r => !selected.includes(r.name));
  }

  // Create a new URL/URI pair form group
  createUrlUriPair(): FormGroup {
    return this.fb.group({
      url: ['', Validators.required],
      uri: ['', Validators.required],
      httpMethod: ['GET', Validators.required]
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

  setSection(section: 'users' | 'roles' | 'roleUrl' | 'assign' | 'test' | 'products') {
    this.activeSection = section;
    if (section === 'users' || section === 'roles' || section === 'roleUrl' || section === 'assign') {
      this.ensureDataForActiveSection();
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
    const product = raw?.product ?? this.roleForm.get('product')?.value;
    if (!realm || !product) {
      this.roles = [];
      return;
    }
    this.loadRolesForProduct(product);
  }

  private loadRolesForProduct(product: string): void {
    const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
    if (!realm || !product) {
      this.roles = [];
      return;
    }
    const requestSeq = ++this.rolesRequestSeq;
    this.apiGateway.getRoles(realm, product).subscribe({
      next: (data: any[]) => {
        if (requestSeq !== this.rolesRequestSeq || !this.isProductStillSelected(product)) {
          return;
        }
        this.roles = (data || []).map((r: any) => ({ ...r, product }));
      },
      error: (err: any) => {
        if (requestSeq !== this.rolesRequestSeq) {
          return;
        }
        console.error('Error loading roles:', err);
        if (!this.roles.length) {
          this.roles = [];
        }
      },
    });
  }

  private isProductStillSelected(product: string): boolean {
    if (this.activeSection === 'assign') {
      return this.assignForm.get('product')?.value === product;
    }
    return this.roleForm.get('product')?.value === product;
  }


loadProducts(): void {
  const realm = this.currentRealm || this.roleForm.get('realm')?.value;
  if (!realm) return;

  const requestSeq = ++this.productsRequestSeq;
  this.apiGateway.getProducts(realm).subscribe({
    next: (data: any) => {
      if (requestSeq !== this.productsRequestSeq) {
        return;
      }
      console.log('Products loaded:', data);
      this.products = (data || [])
        .map((p: any) => productRowToOption(p))
        .filter((x: ProductOption | null): x is ProductOption => x != null);

      const selectedProduct = this.roleForm.get('product')?.value;
      const selectedExists = this.products.some((product) => product.clientId === selectedProduct);
      if ((!selectedProduct || !selectedExists) && this.products.length) {
        this.roleForm.patchValue({ product: this.products[0].clientId });
      } else if ((this.activeSection === 'roles' || this.activeSection === 'roleUrl') && selectedProduct) {
        this.loadRolesForProduct(selectedProduct);
      }

      const selectedAssignProduct = this.assignForm.get('product')?.value;
      const selectedAssignExists = this.products.some((product) => product.clientId === selectedAssignProduct);
      if ((!selectedAssignProduct || !selectedAssignExists) && this.products.length) {
        this.assignForm.patchValue({ product: this.products[0].clientId });
      } else if (this.activeSection === 'assign' && selectedAssignProduct) {
        this.loadRolesForProduct(selectedAssignProduct);
      }
    },
    error: (err: any) => {
      if (requestSeq !== this.productsRequestSeq) {
        return;
      }
      console.error('Failed to load products:', err);
      if (!this.products.length) {
        this.products = [];
      }
    }
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

onEditUser(user: any): void {
  this.editingUsername = user.username;

  this.userForm.patchValue({
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: ''
  });

  this.userForm.get('username')?.disable();

  this.showEditModal = true;
}
closeEditModal(): void {
  this.showEditModal = false;
  this.userForm.reset();
  this.userForm.get('username')?.enable();
  this.editingUsername = null;
}

// ✅ DELETE USERs
onDeleteUser(user: any): void {
  const realm = this.currentRealm;

  if (!confirm(`Delete ${user.username}?`)) return;

  this.keycloakService.deleteUser(realm, user.username)
    .subscribe({
      next: () => {
        alert('✅ User deleted successfully');
        this.loadUsers();
      },
      error: () => alert('❌ Delete failed')
    });
}


// Update user details emitted from UsersTab modals.
updateUserFromModal(updatedData: { username: string; email: string; firstName: string; lastName: string }): void {
  if (!updatedData?.username) {
    alert('No user selected for editing');
    return;
  }

  const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;

  if (!realm) {
    alert('Realm not found');
    return;
  }

  const payload = {
    firstName: updatedData.firstName,
    lastName: updatedData.lastName,
    email: updatedData.email,
    enabled: true
  };

  this.apiGateway.updateUser(realm, updatedData.username, payload)
    .subscribe({
      next: () => {
        alert('✅ User updated successfully');
        this.loadUsers();
      },
      error: (err: any) => {
        console.error(err);
        alert('❌ Update failed');
      }
    });
}

  createProduct(): void {
    if (this.productForm.valid) {
      const realm = this.currentRealm || this.roleForm.get('realm')?.value;
      if (!realm) {
        alert('Please select a realm first');
        return;
      }
      
      const form = this.productForm.value;
      const body: any = {
        productId: form.clientId,
        publicClient: form.publicClient,
        rootUrl: form.rootUrl,
        baseUrl: form.rootUrl,
        redirectUris: form.redirectUris ? form.redirectUris.split(',').map((s: string) => s.trim()) : [],
        webOrigins: form.webOrigins ? form.webOrigins.split(',').map((s: string) => s.trim()) : []
      };

      this.apiGateway.createProduct(realm, body).subscribe({
        next: () => {
          alert('✅ Product created successfully');
          this.loadProducts();
          this.productForm.reset({ publicClient: true, redirectUris: '*', webOrigins: '*' });
        },
        error: (err: any) => {
          console.error('❌ Failed to create product', err);
          alert('Failed to create product: ' + (err.error?.message || err.message || 'Unknown error'));
        },
      });
    }
  }

createRole(): void {

  const form = this.roleForm.getRawValue();

  if (!form.product || !form.roleName) {
    alert('Product and Role Name are required');
    return;
  }

  const realm = form.realm || this.currentRealm;

  this.keycloakService.createRoleOnly(
    realm,
    form.product,
    form.roleName,
    form.description || ''
  ).subscribe({

    next: () => {
      alert('✅ Role created successfully');

      this.loadRoles();

      // reset only role fields (keep realm & client)
      this.roleForm.patchValue({
        roleName: '',
        description: ''
      });
    },

    error: err => {
      console.error(err);
      alert('❌ Role creation failed');
    }

  });
}

saveRolePermissions(): void {

  const form = this.roleForm.getRawValue();

  if (!form.product || !form.selectedRole) {
    alert('Please select product and role');
    return;
  }

  const realm = this.currentRealm || form.realm;

  const urls = form.urlUriPairs.filter(
    (p: any) => p.url && p.uri && p.httpMethod
  );

  if (urls.length === 0) {
    alert('Add at least one URL permission');
    return;
  }

  this.keycloakService.saveRoleUrls(
    realm,
    form.product,
    form.selectedRole,
    urls
  ).subscribe({

    next: () => {
      alert('✅ Permissions saved successfully');
    },

    error: (err: any) => {
      console.error(err);
      alert('❌ Failed to save permissions');
    }

  });
}

addRoleToAssignment(roleName: string): void {
  if (!roleName) return;
  const control = this.assignForm.get('roleName');
  if (control) {
      const currentRoles = control.value as string[];
      if (!currentRoles.includes(roleName)) {
          control.setValue([...currentRoles, roleName]);
      }
  }
}

removeRoleFromAssignment(roleNameToRemove: string): void {
    const control = this.assignForm.get('roleName');
    if (control) {
        const currentRoles = control.value as string[];
        control.setValue(currentRoles.filter(r => r !== roleNameToRemove));
    }
}


  assignRole(): void {
    if (this.assignForm.valid) {
      const realm = this.currentRealm || this.roleForm.get('realm')?.value;
      if (!realm) {
        alert('Please select a realm first');
        return;
      }
      const { userId, product, roleName } = this.assignForm.value;
      const user = this.users.find((u) => u.id === userId);
      if (!user || !user.username) {
        alert('User not found or username missing');
        return;
      }
      const roles = Array.isArray(roleName) ? roleName : [roleName];
      this.keycloakService.assignRole(realm, user.username, product, roles).subscribe({
        next: () => {
          alert('✅ Roles assigned successfully');
          this.assignForm.reset();
        },
        error: (err: any) => {
          console.error('❌ Failed to assign roles', err);
          alert('Failed to assign roles: ' + (err.error?.message || err.message || 'Unknown error'));
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
          const doc = yaml.load(content as string);
          if (doc == null || typeof doc !== 'object') {
            alert('Invalid OpenAPI YAML (empty or not an object).');
            return;
          }
          spec = doc;
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
    if (!spec || typeof spec !== 'object') {
      alert('Invalid OpenAPI spec');
      return;
    }
    const rec = spec as Record<string, unknown>;
    if (!rec['paths']) {
      alert('No paths found in OpenAPI spec');
      return;
    }

    this.openApiBaseUrl = extractOpenApiBaseUrl(rec);
    this.openApiEndpoints = parseOpenApiToEndpoints(rec);

    if (this.openApiEndpoints.length === 0) {
      alert('No endpoints found in OpenAPI spec');
    } else if (!this.openApiBaseUrl) {
      const userUrl = prompt('Enter the base URL for these endpoints (e.g., http://localhost:8083):');
      if (userUrl) {
        this.openApiBaseUrl = userUrl;
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
    alert('Base URL is required.');
    return;
  }

  // Clear existing pairs
  this.urlUriPairs.clear();

  // Create one entry PER path + method
  selectedEndpoints.forEach(endpoint => {
    const urlUriPair = this.createUrlUriPair();

    urlUriPair.patchValue({
      url: this.openApiBaseUrl,
      uri: endpoint.path,
      httpMethod: endpoint.method   // ✅ now included
    });

    this.urlUriPairs.push(urlUriPair);
  });

  alert(`✅ Loaded ${selectedEndpoints.length} endpoint(s) with HTTP methods`);
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

  /** Apply selected OpenAPI operations and POST them to project-manager (same as filling the form + Save). */
  loadSelectedEndpointsAndSave(): void {
    const selectedEndpoints = this.openApiEndpoints.filter((e) => e.selected);
    if (selectedEndpoints.length === 0) {
      alert('Please select at least one endpoint');
      return;
    }
    if (!this.openApiBaseUrl?.trim()) {
      alert('Base URL is required (from OpenAPI servers[] or enter when prompted).');
      return;
    }
    const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
    const product = this.roleForm.getRawValue()?.product;
    const selectedRole = this.roleForm.getRawValue()?.selectedRole;
    if (!realm || !product || !selectedRole) {
      alert('Please select product and role first.');
      return;
    }

    const urls = endpointsToRoleUrlPayload(selectedEndpoints, this.openApiBaseUrl);

    this.keycloakService.saveRoleUrls(realm, product, selectedRole, urls).subscribe({
      next: () =>
        alert(`Saved ${selectedEndpoints.length} URI(s) for role "${selectedRole}" from OpenAPI.`),
      error: (err: any) => {
        console.error(err);
        alert('Failed to save permissions: ' + (err.error?.message || err.message || 'Unknown error'));
      },
    });
  }
}
