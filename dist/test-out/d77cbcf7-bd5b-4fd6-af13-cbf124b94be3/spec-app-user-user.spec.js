import {
  KeycloakService,
  init_keycloak
} from "./chunk-EOATDBBI.js";
import {
  ApiGatewayService,
  init_api_gateway_service
} from "./chunk-R5UM7S7V.js";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  init_forms
} from "./chunk-YUDCIBMT.js";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  convertToParamMap,
  init_router
} from "./chunk-RUMTJXB2.js";
import {
  CommonModule,
  init_common
} from "./chunk-BUAUFQFR.js";
import "./chunk-WHVCLFVD.js";
import {
  getStoredRealm,
  getStoredToken,
  init_auth_storage,
  init_http,
  provideHttpClient
} from "./chunk-NLLKBMSJ.js";
import "./chunk-IWFMZ7NL.js";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Subject,
  TestBed,
  __decorate,
  filter,
  init_core,
  init_esm,
  init_testing,
  init_tslib_es6,
  of
} from "./chunk-5VF64QHA.js";
import {
  __async,
  __commonJS,
  __esm,
  __spreadProps,
  __spreadValues
} from "./chunk-V6FC2DIM.js";

// angular:jit:template:src/app/user/user.html
var user_default;
var init_user = __esm({
  "angular:jit:template:src/app/user/user.html"() {
    user_default = `<div class="user-page">

 <!-- @if (showTabs) {
<div class="tabs" *ngIf="showTabs">
  <button [class.active]="activeSection === 'users'" (click)="setSection('users')">Users</button>
  <button [class.active]="activeSection === 'roles'" (click)="setSection('roles')">Roles</button>
  <button [class.active]="activeSection === 'roleUrl'" (click)="setSection('roleUrl')">Role Url</button>
  <button [class.active]="activeSection === 'assign'" (click)="setSection('assign')">Assign Roles</button>
</div>
 } -->


  <!-- Users Tabs -->
<div *ngIf="currentSectionFromUrl === 'users'">
  <app-users-tab
    [currentRealm]="currentRealm"
    [users]="users"
    [userForm]="userForm"
    (createUser)="createUser()"
    (updateUser)="updateUserFromModal($event)"
     (deleteUser)="onDeleteUser($event)"
  ></app-users-tab>
</div>

<!-- Roles Tab -->
<div *ngIf="currentSectionFromUrl === 'roles'">
  <app-roles-tab
    [roleForm]="roleForm"
    [products]="products"
    [roles]="roles"
    (createRole)="createRole()"
  ></app-roles-tab>
</div>


<!-- Role URL / URI Tab -->
<div *ngIf="currentSectionFromUrl === 'roleUrl'">
  <app-role-url-tab
    [roleForm]="roleForm"
    [products]="products"
    [roles]="roles"
    [openApiEndpoints]="openApiEndpoints"
    (addUrlUriPair)="addUrlUriPair()"
    (removeUrlUriPair)="removeUrlUriPair($event)"
    (openApiFileSelected)="onOpenApiFileSelected($event)"
    (toggleEndpointSelection)="toggleEndpointSelection($event)"
    (selectAllEndpoints)="selectAllEndpoints()"
    (deselectAllEndpoints)="deselectAllEndpoints()"
    (savePermissions)="saveRolePermissions()"
    (loadSelectedEndpoints)="loadSelectedEndpointsToForm()"
    (clearOpenApi)="clearOpenApiData()"
  ></app-role-url-tab>
</div>

<!-- Assign Role Tab -->
<div *ngIf="currentSectionFromUrl === 'assign-roles'">
  <div class="section section-assign">
    <h3><i class="fa-solid fa-user-plus"></i> Assign Role to User</h3>
    <div class="field">
      <label>Realm: <span class="required">*</span></label>
      <input type="text" [ngModel]="currentRealm" [ngModelOptions]="{standalone: true}" readonly placeholder="Realm name" />
    </div>
    <form [formGroup]="assignForm" (ngSubmit)="assignRole()">
      <div class="field">
        <label>Select User: <span class="required">*</span></label>
        <select formControlName="userId">
          <option value="">--Select User--</option>
          <option *ngFor="let user of users" [value]="user.id">{{ user.username }} ({{ user.email }})</option>
        </select>
      </div>
      <div class="field">
        <label>Select Product: <span class="required">*</span></label>
        <select formControlName="product">
          <option value="">--Select Product--</option>
          <option *ngFor="let product of products" [value]="product">{{ product }}</option>
        </select>
      </div>

      <!-- New Role Selection UI -->
      <div class="field">
        <label>Selected Roles:</label>
        <div class="selected-roles-container" *ngIf="selectedRoleNames.length > 0; else noRolesSelected" style="border: 1px solid #ccc; padding: 10px; min-height: 40px; border-radius: 4px; display: flex; flex-wrap: wrap; gap: 5px;">
          <span *ngFor="let roleName of selectedRoleNames" style="background-color: #e0e0e0; padding: 5px 10px; border-radius: 15px; display: flex; align-items: center; gap: 5px;">
            {{ roleName }}
            <button type="button" (click)="removeRoleFromAssignment(roleName)" style="border: none; background: none; cursor: pointer; font-size: 16px; line-height: 1;">&times;</button>
          </span>
        </div>
        <ng-template #noRolesSelected>
          <div style="border: 1px solid #ccc; padding: 10px; min-height: 40px; border-radius: 4px; color: #777;">No roles selected yet.</div>
        </ng-template>
      </div>

      <div class="field">
        <label>Add Role:</label>
        <select #roleSelect (change)="addRoleToAssignment(roleSelect.value); roleSelect.value = ''">
          <option value="">--Select a role to add--</option>
          <option *ngFor="let role of availableRolesForAssignment" [value]="role.name">{{ role.name }}</option>
        </select>
      </div>
      
      <button type="submit" [disabled]="assignForm.invalid || !currentRealm"><i class="fa-solid fa-check-circle"></i> Assign Roles</button>
    </form>
  </div>
</div>


  <!-- Logout -->
  <div class="logout">
    <button (click)="logout()">
      <i class="fa-solid fa-sign-out-alt"></i> Logout
    </button>
  </div>

</div>

`;
  }
});

// angular:jit:style:src/app/user/user.css
var user_default2;
var init_user2 = __esm({
  "angular:jit:style:src/app/user/user.css"() {
    user_default2 = '/* src/app/user/user.css */\n.user-page {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: var(--spacing-xl);\n}\n.tabs {\n  display: flex;\n  gap: var(--spacing-sm);\n  margin-bottom: var(--spacing-xl);\n  background: var(--bg-primary);\n  padding: var(--spacing-sm);\n  border-radius: var(--border-radius-lg);\n  box-shadow: var(--shadow-sm);\n  overflow-x: auto;\n}\n.tabs button {\n  flex: 1;\n  min-width: 120px;\n  padding: var(--spacing-md) var(--spacing-lg);\n  border: none;\n  border-radius: var(--border-radius);\n  background: transparent;\n  font-weight: 600;\n  font-size: var(--font-size-sm);\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition: var(--transition);\n  white-space: nowrap;\n}\n.tabs button:hover {\n  background: var(--gray-100);\n  color: var(--text-primary);\n}\n.tabs button.active {\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary) 0%,\n      var(--primary-dark) 100%);\n  color: var(--text-white);\n  box-shadow: var(--shadow);\n}\n.section {\n  background: var(--bg-primary);\n  padding: var(--spacing-xl);\n  border-radius: var(--border-radius-lg);\n  margin-bottom: var(--spacing-lg);\n  box-shadow: var(--shadow);\n  border-top: 4px solid var(--primary);\n}\n.section h3 {\n  margin-bottom: var(--spacing-lg);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n  color: var(--text-primary);\n  font-size: var(--font-size-xl);\n  font-weight: 600;\n}\n.section h4 {\n  margin-top: var(--spacing-lg);\n  margin-bottom: var(--spacing-md);\n  color: var(--text-primary);\n  font-size: var(--font-size-lg);\n}\n.field {\n  margin-bottom: var(--spacing-lg);\n}\n.field label {\n  display: block;\n  font-weight: 500;\n  color: var(--text-primary);\n  margin-bottom: var(--spacing-xs);\n  font-size: var(--font-size-sm);\n}\n.field input,\n.field select {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  font-size: var(--font-size-base);\n  border: 1px solid var(--border-color);\n  border-radius: var(--border-radius);\n  transition: var(--transition);\n}\n.field input:focus,\n.field select:focus {\n  outline: none;\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.error-text {\n  color: var(--error);\n  font-size: var(--font-size-xs);\n  margin-top: var(--spacing-xs);\n  display: block;\n}\nbutton[type=submit],\n.btn-submit {\n  padding: var(--spacing-md) var(--spacing-xl);\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary) 0%,\n      var(--primary-dark) 100%);\n  color: var(--text-white);\n  border: none;\n  border-radius: var(--border-radius);\n  font-weight: 600;\n  font-size: var(--font-size-base);\n  cursor: pointer;\n  transition: var(--transition);\n  width: 100%;\n  margin-top: var(--spacing-lg);\n}\nbutton[type=submit]:hover:not(:disabled),\n.btn-submit:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: var(--shadow-md);\n}\nbutton[type=submit]:disabled,\n.btn-submit:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.logout {\n  text-align: center;\n  margin-top: var(--spacing-2xl);\n}\n.logout button {\n  background: var(--error);\n  color: var(--text-white);\n  padding: var(--spacing-md) var(--spacing-xl);\n  border: none;\n  border-radius: var(--border-radius);\n  font-weight: 600;\n  cursor: pointer;\n  transition: var(--transition);\n}\n.logout button:hover {\n  background: #dc2626;\n  transform: translateY(-1px);\n  box-shadow: var(--shadow-md);\n}\ntable {\n  width: 100%;\n  border-collapse: collapse;\n  background: var(--bg-primary);\n  border-radius: var(--border-radius);\n  overflow: hidden;\n  box-shadow: var(--shadow-sm);\n  margin-top: var(--spacing-lg);\n}\ntable th {\n  background: var(--gray-50);\n  padding: var(--spacing-md);\n  text-align: left;\n  font-weight: 600;\n  color: var(--text-primary);\n  font-size: var(--font-size-sm);\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\ntable td {\n  padding: var(--spacing-md);\n  border-top: 1px solid var(--border-color);\n  color: var(--text-secondary);\n}\ntable tbody tr:hover {\n  background: var(--gray-50);\n}\n.url-uri-section {\n  margin: var(--spacing-lg) 0;\n  padding: var(--spacing-lg);\n  background: var(--gray-50);\n  border-radius: var(--border-radius);\n  border: 1px solid var(--border-color);\n}\n.section-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: var(--spacing-md);\n}\n.section-header h4 {\n  margin: 0;\n  color: var(--primary);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n.btn-add {\n  padding: var(--spacing-sm) var(--spacing-md);\n  background-color: var(--success);\n  color: var(--text-white);\n  border: none;\n  border-radius: var(--border-radius);\n  font-weight: 600;\n  cursor: pointer;\n  transition: var(--transition);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-xs);\n  font-size: var(--font-size-sm);\n}\n.btn-add:hover {\n  background-color: #059669;\n  transform: translateY(-1px);\n}\n.url-uri-pairs {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-md);\n}\n.url-uri-pair {\n  background: var(--bg-primary);\n  padding: var(--spacing-md);\n  border-radius: var(--border-radius);\n  border: 1px solid var(--border-color);\n  box-shadow: var(--shadow-sm);\n}\n.pair-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: var(--spacing-md);\n  padding-bottom: var(--spacing-sm);\n  border-bottom: 1px solid var(--border-color);\n}\n.pair-number {\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.btn-remove {\n  padding: var(--spacing-xs) var(--spacing-sm);\n  background-color: var(--error);\n  color: var(--text-white);\n  border: none;\n  border-radius: var(--border-radius);\n  cursor: pointer;\n  font-size: var(--font-size-xs);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-xs);\n  transition: var(--transition);\n}\n.btn-remove:hover:not(:disabled) {\n  background-color: #dc2626;\n}\n.btn-remove:disabled {\n  background-color: var(--gray-300);\n  cursor: not-allowed;\n}\n.pair-fields {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: var(--spacing-md);\n}\n.url-input,\n.uri-input {\n  width: 100%;\n}\n.help-text {\n  margin-top: var(--spacing-md);\n  padding: var(--spacing-md);\n  background: #dbeafe;\n  border-left: 4px solid var(--primary);\n  border-radius: var(--border-radius);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n  color: #1e40af;\n  font-size: var(--font-size-sm);\n}\n.openapi-section {\n  margin: var(--spacing-lg) 0;\n  padding: var(--spacing-lg);\n  background: #eff6ff;\n  border-radius: var(--border-radius);\n  border: 1px solid #bfdbfe;\n}\n.openapi-section h4 {\n  margin: 0 0 var(--spacing-md) 0;\n  color: var(--primary);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n.file-input {\n  width: 100%;\n  padding: var(--spacing-sm);\n  border: 1px solid var(--border-color);\n  border-radius: var(--border-radius);\n  background: var(--bg-primary);\n  cursor: pointer;\n}\n.openapi-preview {\n  margin-top: var(--spacing-md);\n  padding: var(--spacing-md);\n  background: var(--bg-primary);\n  border-radius: var(--border-radius);\n  border: 1px solid var(--border-color);\n}\n.openapi-preview h5 {\n  margin-top: 0;\n  margin-bottom: var(--spacing-md);\n  color: var(--text-primary);\n}\n.endpoints-list {\n  max-height: 300px;\n  overflow-y: auto;\n  margin-bottom: var(--spacing-md);\n  border: 1px solid var(--border-color);\n  border-radius: var(--border-radius);\n  padding: var(--spacing-sm);\n}\n.endpoint-item {\n  padding: var(--spacing-sm);\n  border-bottom: 1px solid var(--gray-200);\n}\n.endpoint-item:last-child {\n  border-bottom: none;\n}\n.endpoint-item label {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  cursor: pointer;\n  width: 100%;\n}\n.endpoint-item code {\n  background: #dbeafe;\n  padding: var(--spacing-xs) var(--spacing-sm);\n  border-radius: var(--border-radius);\n  font-family: "Courier New", monospace;\n  font-weight: 600;\n  min-width: 150px;\n}\n.endpoint-description {\n  color: var(--text-secondary);\n  font-size: var(--font-size-sm);\n  font-style: italic;\n}\n.endpoint-actions {\n  display: flex;\n  gap: var(--spacing-sm);\n  flex-wrap: wrap;\n}\n.btn-select-all,\n.btn-deselect-all,\n.btn-load-endpoints,\n.btn-clear-openapi {\n  padding: var(--spacing-sm) var(--spacing-md);\n  border: none;\n  border-radius: var(--border-radius);\n  font-weight: 600;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-xs);\n  transition: var(--transition);\n  font-size: var(--font-size-sm);\n}\n.btn-select-all {\n  background-color: var(--success);\n  color: var(--text-white);\n}\n.btn-select-all:hover {\n  background-color: #059669;\n}\n.btn-deselect-all {\n  background-color: var(--warning);\n  color: var(--text-white);\n}\n.btn-deselect-all:hover {\n  background-color: #d97706;\n}\n.btn-load-endpoints {\n  background-color: var(--primary);\n  color: var(--text-white);\n}\n.btn-load-endpoints:hover {\n  background-color: var(--primary-dark);\n}\n.btn-clear-openapi {\n  background-color: var(--gray-500);\n  color: var(--text-white);\n}\n.btn-clear-openapi:hover {\n  background-color: var(--gray-600);\n}\n.section-test {\n  border-top-color: var(--success);\n}\n.url-input-full {\n  width: 100%;\n}\n.help-text-small {\n  display: block;\n  margin-top: var(--spacing-xs);\n  color: var(--text-secondary);\n  font-size: var(--font-size-xs);\n}\n.btn-test {\n  padding: var(--spacing-md) var(--spacing-lg);\n  background-color: var(--success);\n  color: var(--text-white);\n  border: none;\n  border-radius: var(--border-radius);\n  font-weight: 600;\n  cursor: pointer;\n  transition: var(--transition);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n  margin-top: var(--spacing-md);\n}\n.btn-test:hover:not(:disabled) {\n  background-color: #059669;\n  transform: translateY(-1px);\n}\n.btn-test:disabled {\n  background-color: var(--gray-300);\n  cursor: not-allowed;\n}\n.test-result {\n  margin-top: var(--spacing-lg);\n  padding: var(--spacing-lg);\n  border-radius: var(--border-radius);\n  border: 2px solid;\n}\n.test-result.allowed {\n  background-color: #d1fae5;\n  border-color: var(--success);\n}\n.test-result.denied {\n  background-color: #fee2e2;\n  border-color: var(--error);\n}\n.result-header {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  margin-bottom: var(--spacing-md);\n}\n.result-header h4 {\n  margin: 0;\n  font-size: var(--font-size-lg);\n}\n.success-icon {\n  color: var(--success);\n  font-size: var(--font-size-xl);\n}\n.error-icon {\n  color: var(--error);\n  font-size: var(--font-size-xl);\n}\n.result-details {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-md);\n}\n.detail-row {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-xs);\n}\n.detail-row strong {\n  color: var(--text-primary);\n  font-size: var(--font-size-sm);\n}\n.detail-row code {\n  background: var(--gray-100);\n  padding: var(--spacing-xs) var(--spacing-sm);\n  border-radius: var(--border-radius);\n  font-family: "Courier New", monospace;\n  word-break: break-all;\n}\n.roles-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--spacing-sm);\n  margin-top: var(--spacing-xs);\n}\n.role-badge {\n  background-color: var(--primary);\n  color: var(--text-white);\n  padding: var(--spacing-xs) var(--spacing-md);\n  border-radius: 9999px;\n  font-size: var(--font-size-xs);\n  font-weight: 500;\n}\n.matched-role {\n  background-color: var(--success);\n  color: var(--text-white);\n  padding: var(--spacing-xs) var(--spacing-md);\n  border-radius: 9999px;\n  font-weight: 600;\n  display: inline-block;\n}\n.allowed-urls-list {\n  margin-top: var(--spacing-sm);\n  padding-left: var(--spacing-lg);\n}\n.allowed-urls-list li {\n  margin-bottom: var(--spacing-sm);\n}\n.allowed-urls-list code {\n  background: #dbeafe;\n  padding: var(--spacing-xs) var(--spacing-sm);\n  border-radius: var(--border-radius);\n}\n.token-info {\n  margin-top: var(--spacing-xl);\n  padding: var(--spacing-lg);\n  background: var(--gray-50);\n  border-radius: var(--border-radius);\n  border: 1px solid var(--border-color);\n}\n.token-info h4 {\n  margin-top: 0;\n  margin-bottom: var(--spacing-md);\n  color: var(--primary);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n.token-details {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-md);\n}\n.token-status {\n  color: var(--success);\n  font-weight: 600;\n}\n.button-group {\n  display: flex;\n  gap: var(--spacing-md);\n  margin-top: var(--spacing-md);\n}\n.btn-clear {\n  padding: var(--spacing-md) var(--spacing-lg);\n  background-color: var(--gray-500);\n  color: var(--text-white);\n  border: none;\n  border-radius: var(--border-radius);\n  font-weight: 600;\n  cursor: pointer;\n  transition: var(--transition);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-sm);\n}\n.btn-clear:hover {\n  background-color: var(--gray-600);\n}\n@media (max-width: 768px) {\n  .user-page {\n    padding: var(--spacing-md);\n  }\n  .tabs {\n    flex-wrap: nowrap;\n    overflow-x: auto;\n  }\n  .tabs button {\n    min-width: 100px;\n    font-size: var(--font-size-xs);\n    padding: var(--spacing-sm) var(--spacing-md);\n  }\n  .section {\n    padding: var(--spacing-md);\n  }\n  .pair-fields {\n    grid-template-columns: 1fr;\n  }\n  .button-group {\n    flex-direction: column;\n  }\n  .endpoint-actions {\n    flex-direction: column;\n  }\n  .endpoint-actions button {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=user.css.map */\n';
  }
});

// angular:jit:template:src/app/user/users-tab/users-tab.component.html
var users_tab_component_default;
var init_users_tab_component = __esm({
  "angular:jit:template:src/app/user/users-tab/users-tab.component.html"() {
    users_tab_component_default = '<div class="section section-users">\n  <h3><i class="fa-solid fa-users"></i> Create User</h3>\n  <div class="field">\n    <label>Realm: <span class="required">*</span></label>\n    <input type="text" [ngModel]="currentRealm" [ngModelOptions]="{standalone: true}" readonly placeholder="Realm name" />\n  </div>\n  <form [formGroup]="userForm" (ngSubmit)="createUser.emit()">\n    <div class="field"><label>Username:</label><input formControlName="username" type="text" /></div>\n    <div class="field"><label>Email:</label><input formControlName="email" type="email" /></div>\n    <div class="field"><label>First Name:</label><input formControlName="firstName" type="text" /></div>\n    <div class="field"><label>Last Name:</label><input formControlName="lastName" type="text" /></div>\n    <div class="field"><label>Password:</label><input formControlName="password" type="password" /></div>\n    <button type="submit" [disabled]="userForm.invalid || !currentRealm"><i class="fa-solid fa-plus-circle"></i> Create User</button>\n  </form>\n\n  <h4>Existing Users</h4>\n  <table>\n    <thead>\n      <tr><th>Username</th><th>Email</th><th>First Name</th><th>Last Name</th></tr>\n    </thead>\n    <tbody>\n      <tr *ngFor="let user of users">\n        <td>{{ user.username }}</td>\n        <td>{{ user.email }}</td>\n        <td>{{ user.firstName }}</td>\n        <td>{{ user.lastName }}</td>\n     <td>\n  <button type="button" (click)="openEditModal(user)">\n  <i class="fa-solid fa-pen-to-square"></i> Edit\n</button>\n</td>\n\n<td>\n  <button type="button" (click)="deleteUser.emit(user)">\n    <i class="fa-solid fa-trash"></i> Delete\n  </button>\n</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n\n<!-- EDIT MODAL -->\n<div class="modal-backdrop" *ngIf="showEditModal">\n  <div class="modal">\n\n    <h3>Edit User</h3>\n\n    <form [formGroup]="editForm">\n\n      <div class="field">\n        <label>Username</label>\n        <input formControlName="username" readonly />\n      </div>\n\n      <div class="field">\n        <label>Email</label>\n        <input formControlName="email" type="email" />\n      </div>\n\n      <div class="field">\n        <label>First Name</label>\n        <input formControlName="firstName" />\n      </div>\n\n      <div class="field">\n        <label>Last Name</label>\n        <input formControlName="lastName" />\n      </div>\n\n    </form>\n\n    <div class="modal-actions">\n      <button (click)="saveEdit()" [disabled]="editForm.invalid">\n        Save\n      </button>\n      <button (click)="closeModal()">Cancel</button>\n    </div>\n\n  </div>\n</div>\n';
  }
});

// angular:jit:style:src/app/user/users-tab/users-tab.component.css
var users_tab_component_default2;
var init_users_tab_component2 = __esm({
  "angular:jit:style:src/app/user/users-tab/users-tab.component.css"() {
    users_tab_component_default2 = "/* src/app/user/users-tab/users-tab.component.css */\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n.modal {\n  background: white;\n  padding: 25px;\n  border-radius: 8px;\n  width: 400px;\n}\n/*# sourceMappingURL=users-tab.component.css.map */\n";
  }
});

// src/app/user/users-tab/users-tab.component.ts
var UsersTabComponent;
var init_users_tab_component3 = __esm({
  "src/app/user/users-tab/users-tab.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_users_tab_component();
    init_user2();
    init_users_tab_component2();
    init_core();
    init_common();
    init_forms();
    UsersTabComponent = class UsersTabComponent2 {
      fb;
      currentRealm = "";
      users = [];
      userForm;
      createUser = new EventEmitter();
      deleteUser = new EventEmitter();
      updateUser = new EventEmitter();
      showEditModal = false;
      editingUser = null;
      editForm;
      constructor(fb) {
        this.fb = fb;
        this.editForm = this.fb.group({
          username: [{ value: "", disabled: true }],
          email: ["", [Validators.required, Validators.email]],
          firstName: ["", Validators.required],
          lastName: ["", Validators.required]
        });
      }
      openEditModal(user) {
        this.editingUser = user;
        this.showEditModal = true;
        this.editForm.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }
      closeModal() {
        this.showEditModal = false;
        this.editingUser = null;
      }
      saveEdit() {
        if (this.editForm.invalid)
          return;
        const updatedData = {
          username: this.editingUser.username,
          email: this.editForm.value.email,
          firstName: this.editForm.value.firstName,
          lastName: this.editForm.value.lastName
        };
        this.updateUser.emit(updatedData);
        this.closeModal();
      }
      static ctorParameters = () => [
        { type: FormBuilder }
      ];
      static propDecorators = {
        currentRealm: [{ type: Input }],
        users: [{ type: Input }],
        userForm: [{ type: Input }],
        createUser: [{ type: Output }],
        deleteUser: [{ type: Output }],
        updateUser: [{ type: Output }]
      };
    };
    UsersTabComponent = __decorate([
      Component({
        selector: "app-users-tab",
        standalone: true,
        imports: [CommonModule, FormsModule, ReactiveFormsModule],
        template: users_tab_component_default,
        styles: [user_default2, users_tab_component_default2]
      })
    ], UsersTabComponent);
  }
});

// angular:jit:template:src/app/user/roles-tab/roles-tab.component.html
var roles_tab_component_default;
var init_roles_tab_component = __esm({
  "angular:jit:template:src/app/user/roles-tab/roles-tab.component.html"() {
    roles_tab_component_default = '<div class="section section-roles">\n  <h3>Create Role</h3>\n\n  <form [formGroup]="roleForm" (ngSubmit)="onSubmit($event)">\n\n    <div class="field">\n      <label>Realm</label>\n      <input type="text" formControlName="realm" readonly />\n    </div>\n\n    <div class="field">\n      <label>Product</label>\n      <select formControlName="product">\n        <option value="">-- Select Product --</option>\n        <option *ngFor="let product of products" [value]="product">\n          {{ product }}\n        </option>\n      </select>\n    </div>\n\n    <div class="field">\n      <label>Role Name</label>\n      <input type="text" formControlName="roleName" />\n    </div>\n\n    <div class="field">\n      <label>Description</label>\n      <input type="text" formControlName="description" />\n    </div>\n\n    <button type="submit" class="btn-submit">\n      Create Role\n    </button>\n  </form>\n\n  <h4>Existing Roles</h4>\n  <table>\n    <thead>\n      <tr>\n        <th>Product</th>\n        <th>Role</th>\n        <th>Description</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor="let role of roles">\n        <td>{{ role.product }}</td>\n        <td>{{ role.name }}</td>\n        <td>{{ role.description }}</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n';
  }
});

// angular:jit:style:src/app/user/roles-tab/roles-tab.component.css
var roles_tab_component_default2;
var init_roles_tab_component2 = __esm({
  "angular:jit:style:src/app/user/roles-tab/roles-tab.component.css"() {
    roles_tab_component_default2 = "/* src/app/user/roles-tab/roles-tab.component.css */\n/*# sourceMappingURL=roles-tab.component.css.map */\n";
  }
});

// src/app/user/roles-tab/roles-tab.component.ts
var RolesTabComponent;
var init_roles_tab_component3 = __esm({
  "src/app/user/roles-tab/roles-tab.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_roles_tab_component();
    init_user2();
    init_roles_tab_component2();
    init_core();
    init_common();
    init_forms();
    RolesTabComponent = class RolesTabComponent2 {
      roleForm;
      products = [];
      roles = [];
      createRole = new EventEmitter();
      onSubmit(event) {
        event.preventDefault();
        this.createRole.emit();
      }
      static propDecorators = {
        roleForm: [{ type: Input }],
        products: [{ type: Input }],
        roles: [{ type: Input }],
        createRole: [{ type: Output }]
      };
    };
    RolesTabComponent = __decorate([
      Component({
        selector: "app-roles-tab",
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule],
        template: roles_tab_component_default,
        styles: [user_default2, roles_tab_component_default2]
      })
    ], RolesTabComponent);
  }
});

// angular:jit:template:src/app/user/roles-urls-tab/role-url-tab.html
var role_url_tab_default;
var init_role_url_tab = __esm({
  "angular:jit:template:src/app/user/roles-urls-tab/role-url-tab.html"() {
    role_url_tab_default = '<div class="role-url-tab" [formGroup]="roleForm">\n  <h3>Configure Role URLs</h3>\n\n  <div class="form-row" style="display: flex; gap: 20px; margin-bottom: 20px;">\n    <div class="form-group" style="flex: 1;">\n      <label>Product</label>\n      <select formControlName="product" class="form-control">\n        <option value="" disabled>Select Product</option>\n        <option *ngFor="let product of products" [value]="product">\n          {{ product }}\n        </option>\n      </select>\n    </div>\n\n    <div class="form-group" style="flex: 1;">\n      <label>Role</label>\n      <select formControlName="selectedRole" class="form-control">\n        <option value="" disabled>Select Role</option>\n        <option *ngFor="let role of roles" [value]="role.name">\n          {{ role.name }}\n        </option>\n      </select>\n    </div>\n  </div>\n\n  <hr />\n\n  <!-- OpenAPI Section -->\n  <div class="openapi-section" style="margin-bottom: 20px;">\n    <h4>Import from OpenAPI (Optional)</h4>\n    <div class="file-input-row" style="margin-bottom: 10px;">\n      <input type="file" (change)="openApiFileSelected.emit($event)" accept=".json,.yaml,.yml" />\n      <button type="button" (click)="clearOpenApi.emit()" *ngIf="openApiEndpoints.length > 0">Clear</button>\n    </div>\n\n    <div *ngIf="openApiEndpoints.length > 0" class="endpoints-list" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;">\n      <div class="actions" style="margin-bottom: 10px;">\n        <button type="button" (click)="selectAllEndpoints.emit()">Select All</button>\n        <button type="button" (click)="deselectAllEndpoints.emit()">Deselect All</button>\n        <button type="button" (click)="loadSelectedEndpoints.emit()" class="primary">Load Selected to Form</button>\n      </div>\n      <div class="endpoint-item" *ngFor="let endpoint of openApiEndpoints; let i = index">\n        <label>\n          <input type="checkbox" [checked]="endpoint.selected" (change)="toggleEndpointSelection.emit(i)" />\n          <strong>{{ endpoint.method }}</strong> {{ endpoint.path }}\n          <span *ngIf="endpoint.summary" style="color: #666;">- {{ endpoint.summary }}</span>\n        </label>\n      </div>\n    </div>\n  </div>\n\n  <hr />\n\n  <!-- URL/URI Pairs -->\n  <h4>URL Permissions</h4>\n  <div formArrayName="urlUriPairs">\n    <div *ngFor="let pair of urlUriPairs.controls; let i = index" [formGroupName]="i" class="url-pair-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-end;">\n      <div class="form-group">\n        <label>Method</label>\n        <select formControlName="httpMethod" class="form-control">\n          <option value="GET">GET</option>\n          <option value="POST">POST</option>\n          <option value="PUT">PUT</option>\n          <option value="DELETE">DELETE</option>\n          <option value="PATCH">PATCH</option>\n          <option value="*">*</option>\n        </select>\n      </div>\n      <div class="form-group" style="flex: 1;">\n        <label>URL (Base)</label>\n        <input formControlName="url" class="form-control" placeholder="http://localhost:8080" />\n      </div>\n      <div class="form-group" style="flex: 1;">\n        <label>URI (Path)</label>\n        <input formControlName="uri" class="form-control" placeholder="/api/resource" />\n      </div>\n      <button type="button" class="remove-btn" (click)="removeUrlUriPair.emit(i)" *ngIf="urlUriPairs.length > 1" style="margin-bottom: 2px;">\n        <i class="fa fa-trash"></i> Remove\n      </button>\n    </div>\n  </div>\n\n  <div class="actions-row" style="margin-top: 20px;">\n    <button type="button" (click)="addUrlUriPair.emit()">+ Add URL</button>\n    <button type="button" class="save-btn" (click)="savePermissions.emit()" style="margin-left: 10px;">Save Permissions</button>\n  </div>\n</div>';
  }
});

// angular:jit:style:src/app/user/roles-urls-tab/role-url-tab.css
var role_url_tab_default2;
var init_role_url_tab2 = __esm({
  "angular:jit:style:src/app/user/roles-urls-tab/role-url-tab.css"() {
    role_url_tab_default2 = '/* src/app/user/roles-urls-tab/role-url-tab.css */\n.section {\n  background: #ffffff;\n  padding: 24px;\n  border-radius: 12px;\n  margin-bottom: 16px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);\n  border-top: 4px solid #2563eb;\n  font-family: "Inter", sans-serif;\n}\n.section h3 {\n  margin-bottom: 16px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #111827;\n  font-size: 20px;\n  font-weight: 600;\n}\n.section h4 {\n  margin-top: 16px;\n  margin-bottom: 12px;\n  color: #111827;\n  font-size: 18px;\n  font-weight: 500;\n}\n.section select {\n  width: 100%;\n  padding: 10px 12px;\n  border-radius: 8px;\n  border: 1px solid #d1d5db;\n  background: #f9fafb;\n  font-size: 14px;\n  margin-bottom: 16px;\n  transition: 0.2s;\n  cursor: pointer;\n}\n.section select:focus {\n  outline: none;\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.section input[type=file] {\n  width: 100%;\n  padding: 8px 12px;\n  border-radius: 8px;\n  border: 1px solid #d1d5db;\n  background: #f9fafb;\n  cursor: pointer;\n  margin-bottom: 16px;\n  transition: 0.2s;\n}\n.section input[type=file]:hover {\n  border-color: #2563eb;\n}\n.section div[ngIf] {\n  margin-top: 12px;\n}\n.section div[ngFor] label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  margin-bottom: 6px;\n  color: #374151;\n  font-size: 14px;\n}\n.section div[ngFor] input[type=checkbox] {\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n.section button {\n  padding: 8px 16px;\n  margin-right: 8px;\n  margin-top: 12px;\n  border: none;\n  border-radius: 8px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: 0.2s;\n  font-size: 14px;\n}\n.section button:hover {\n  transform: translateY(-1px);\n}\n.section button:nth-of-type(1) {\n  background-color: #059669;\n  color: #fff;\n}\n.section button:nth-of-type(2) {\n  background-color: #d97706;\n  color: #fff;\n}\n.section button:nth-of-type(3) {\n  background-color: #2563eb;\n  color: #fff;\n}\n.section button:nth-of-type(4) {\n  background-color: #6b7280;\n  color: #fff;\n}\n.url-uri-pair {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin-bottom: 12px;\n  padding: 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  background: #f9fafb;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);\n  align-items: center;\n}\n.url-uri-pair input,\n.url-uri-pair select {\n  padding: 8px 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 14px;\n  flex: 1 1 200px;\n  transition: 0.2s;\n}\n.url-uri-pair input:focus,\n.url-uri-pair select:focus {\n  outline: none;\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.url-uri-pair button {\n  background-color: #dc2626;\n  color: #fff;\n  padding: 8px 12px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  flex-shrink: 0;\n}\n.url-uri-pair button:hover {\n  background-color: #b91c1c;\n}\n.section > button:last-child {\n  background-color: #059669;\n  color: #fff;\n  padding: 10px 16px;\n  border-radius: 8px;\n  font-weight: 500;\n}\n.section > button:last-child:hover {\n  background-color: #047857;\n}\n@media (max-width: 768px) {\n  .url-uri-pair {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .url-uri-pair input,\n  .url-uri-pair select {\n    flex: 1 1 auto;\n  }\n  .section button {\n    width: 100%;\n    margin-right: 0;\n    margin-bottom: 8px;\n  }\n}\n/*# sourceMappingURL=role-url-tab.css.map */\n';
  }
});

// src/app/user/roles-urls-tab/role-url-tab.ts
var RoleUrlTabComponent;
var init_role_url_tab3 = __esm({
  "src/app/user/roles-urls-tab/role-url-tab.ts"() {
    "use strict";
    init_tslib_es6();
    init_role_url_tab();
    init_role_url_tab2();
    init_core();
    init_common();
    init_forms();
    RoleUrlTabComponent = class RoleUrlTabComponent2 {
      roleForm;
      products = [];
      roles = [];
      openApiEndpoints = [];
      addUrlUriPair = new EventEmitter();
      removeUrlUriPair = new EventEmitter();
      openApiFileSelected = new EventEmitter();
      toggleEndpointSelection = new EventEmitter();
      selectAllEndpoints = new EventEmitter();
      deselectAllEndpoints = new EventEmitter();
      savePermissions = new EventEmitter();
      loadSelectedEndpoints = new EventEmitter();
      clearOpenApi = new EventEmitter();
      get urlUriPairs() {
        return this.roleForm.get("urlUriPairs");
      }
      static propDecorators = {
        roleForm: [{ type: Input }],
        products: [{ type: Input }],
        roles: [{ type: Input }],
        openApiEndpoints: [{ type: Input }],
        addUrlUriPair: [{ type: Output }],
        removeUrlUriPair: [{ type: Output }],
        openApiFileSelected: [{ type: Output }],
        toggleEndpointSelection: [{ type: Output }],
        selectAllEndpoints: [{ type: Output }],
        deselectAllEndpoints: [{ type: Output }],
        savePermissions: [{ type: Output }],
        loadSelectedEndpoints: [{ type: Output }],
        clearOpenApi: [{ type: Output }]
      };
    };
    RoleUrlTabComponent = __decorate([
      Component({
        selector: "app-role-url-tab",
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule],
        template: role_url_tab_default,
        styles: [role_url_tab_default2]
      })
    ], RoleUrlTabComponent);
  }
});

// src/app/user/user.ts
var User;
var init_user3 = __esm({
  "src/app/user/user.ts"() {
    "use strict";
    init_tslib_es6();
    init_user();
    init_user2();
    init_core();
    init_common();
    init_router();
    init_router();
    init_forms();
    init_keycloak();
    init_api_gateway_service();
    init_auth_storage();
    init_esm();
    init_users_tab_component3();
    init_roles_tab_component3();
    init_role_url_tab3();
    User = class User2 {
      keycloakService;
      apiGateway;
      fb;
      route;
      router;
      users = [];
      roles = [];
      products = [];
      realms = [];
      editingUsername = null;
      currentRealm = "";
      currentProduct = "";
      showEditModal = false;
      activeSection = "users";
      showTabs = true;
      productChangesSub = null;
      assignProductSub = null;
      routeDataSub = null;
      routeEventSub = null;
      routeQuerySub = null;
      userForm;
      roleForm;
      assignForm;
      testAccessForm;
      productForm;
      // Test Access
      testingAccess = false;
      testResult = null;
      currentToken = null;
      tokenInfo = null;
      // OpenAPI Specs
      openApiFile = null;
      openApiEndpoints = [];
      openApiBaseUrl = "";
      _initialLoadDone = false;
      constructor(keycloakService, apiGateway, fb, route, router) {
        this.keycloakService = keycloakService;
        this.apiGateway = apiGateway;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.userForm = this.fb.group({
          username: ["", Validators.required],
          email: ["", [Validators.required, Validators.email]],
          firstName: ["", Validators.required],
          lastName: ["", Validators.required],
          password: ["", Validators.required]
        });
        this.roleForm = this.fb.group({
          realm: [getStoredRealm() || "", Validators.required],
          client: ["", Validators.required],
          product: [""],
          roleName: ["", Validators.required],
          description: [""],
          selectedRole: ["", Validators.required],
          urlUriPairs: this.fb.array([this.createUrlUriPair()])
        });
        this.assignForm = this.fb.group({
          userId: ["", Validators.required],
          product: ["", Validators.required],
          roleName: [[], Validators.required]
        });
        this.testAccessForm = this.fb.group({
          testUrl: ["", Validators.required],
          httpMethod: ["GET"],
          makeActualRequest: [false]
        });
        this.productForm = this.fb.group({
          clientId: ["", Validators.required],
          rootUrl: [""],
          redirectUris: ["*"],
          webOrigins: ["*"],
          publicClient: [true]
        });
      }
      ngOnInit() {
        const token = getStoredToken();
        if (token) {
          this.currentToken = token;
          this.getRealmAndProductFromToken(token);
          this.loadTokenInfo(token);
        }
        const storedRealm = getStoredRealm();
        if (storedRealm) {
          if (!this.currentRealm)
            this.currentRealm = storedRealm;
          if (!this.roleForm.get("realm")?.value)
            this.roleForm.patchValue({ realm: storedRealm });
        }
        this.roleForm.get("realm")?.disable();
        const realm = this.currentRealm || this.roleForm.get("realm")?.value;
        if (realm && !this._initialLoadDone) {
          this._initialLoadDone = true;
          this.loadUsers();
          this.loadProducts();
          this.loadRoles();
        }
        this.productChangesSub = this.roleForm.get("product").valueChanges.subscribe((product) => {
          if (!product) {
            this.roles = [];
            return;
          }
          const realm2 = this.currentRealm || this.roleForm.getRawValue().realm;
          this.keycloakService.getRoles(realm2, product).subscribe({
            next: (data) => {
              this.roles = data || [];
            },
            error: (err) => {
              console.error(err);
              this.roles = [];
            }
          });
          this.urlUriPairs.clear();
          this.urlUriPairs.push(this.createUrlUriPair());
        });
        this.syncSectionFromRoute();
        this.routeDataSub = this.route.data.subscribe(() => {
          this.syncSectionFromRoute();
        });
        this.routeQuerySub = this.route.queryParamMap.subscribe((params) => {
          const section = params.get("section");
          if (section === "users" || section === "roles" || section === "roleUrl" || section === "assign") {
            this.activeSection = section;
          }
        });
        this.routeEventSub = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
          this.syncSectionFromRoute();
        });
      }
      ngOnDestroy() {
        this.productChangesSub?.unsubscribe();
        this.assignProductSub?.unsubscribe();
        this.routeDataSub?.unsubscribe();
        this.routeEventSub?.unsubscribe();
        this.routeQuerySub?.unsubscribe();
      }
      syncSectionFromRoute() {
        const path = this.currentSectionFromUrl;
        if (path === "users") {
          this.activeSection = "users";
        } else if (path === "roles") {
          this.activeSection = "roles";
        } else if (path === "roleUrl") {
          this.activeSection = "roleUrl";
        } else if (path === "assign-roles") {
          this.activeSection = "assign";
        } else {
          const section = this.route.snapshot.data?.["section"];
          if (section === "users" || section === "roles" || section === "roleUrl" || section === "assign") {
            this.activeSection = section;
          } else {
            this.activeSection = "users";
          }
        }
        this.showTabs = true;
        if (this.activeSection === "roles") {
          const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
          if (realm && this.products.length > 0 && !this.roleForm.get("product")?.value) {
            this.roleForm.patchValue({ product: this.products[0] });
          }
          this.loadRoles();
        }
      }
      get currentSectionFromUrl() {
        const cleanUrl = this.router.url.split("?")[0].split("#")[0];
        const path = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
        if (path === "users" || path === "roles" || path === "roleUrl" || path === "assign-roles") {
          return path;
        }
        return "";
      }
      // Get URL/URI pairs FormArray
      get urlUriPairs() {
        return this.roleForm.get("urlUriPairs");
      }
      get selectedRoleNames() {
        return this.assignForm.get("roleName")?.value || [];
      }
      get availableRolesForAssignment() {
        const selected = this.selectedRoleNames;
        return this.roles.filter((r) => !selected.includes(r.name));
      }
      // Create a new URL/URI pair form group
      createUrlUriPair() {
        return this.fb.group({
          url: ["", Validators.required],
          uri: ["", Validators.required],
          httpMethod: ["GET", Validators.required]
        });
      }
      // Add a new URL/URI pair
      addUrlUriPair() {
        this.urlUriPairs.push(this.createUrlUriPair());
      }
      // Remove a URL/URI pair
      removeUrlUriPair(index) {
        if (this.urlUriPairs.length > 1) {
          this.urlUriPairs.removeAt(index);
        }
      }
      // Get realm and product from token
      getRealmAndProductFromToken(token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          this.currentRealm = payload.realm || payload.iss?.split("/realms/")[1] || "";
          this.currentProduct = payload.product || payload.azp || "";
          if (this.currentRealm) {
            this.roleForm.patchValue({ realm: this.currentRealm });
          }
        } catch (e) {
          console.warn("Could not extract realm/product from token");
        }
      }
      setSection(section) {
        this.activeSection = section;
        if (section === "roles") {
          const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
          if (realm && this.products.length > 0 && !this.roleForm.get("product")?.value) {
            this.roleForm.patchValue({ product: this.products[0] });
          }
          this.loadRoles();
        }
        if (section === "test") {
          const token = getStoredToken();
          if (token) {
            this.currentToken = token;
            this.loadTokenInfo(token);
          }
        }
      }
      loadUsers() {
        const realm = this.currentRealm || this.roleForm.get("realm")?.value;
        if (!realm) {
          console.warn("Cannot load users: realm not specified");
          return;
        }
        this.apiGateway.getUsers(realm).subscribe({
          next: (data) => this.users = data || [],
          error: (err) => console.error("Error loading users:", err)
        });
      }
      loadRoles() {
        const raw = this.roleForm.getRawValue();
        const realm = this.currentRealm || raw?.realm;
        const product = raw?.product ?? this.roleForm.get("product")?.value;
        if (!realm || !product) {
          this.roles = [];
          return;
        }
        this.apiGateway.getRoles(realm, product).subscribe({
          next: (data) => {
            this.roles = (data || []).map((r) => __spreadProps(__spreadValues({}, r), { product }));
          },
          error: (err) => {
            console.error("Error loading roles:", err);
            this.roles = [];
          }
        });
      }
      loadProducts() {
        const realm = this.currentRealm || this.roleForm.get("realm")?.value;
        if (!realm)
          return;
        this.apiGateway.getProducts(realm).subscribe({
          next: (data) => {
            console.log("Products loaded:", data);
            this.products = (data || []).map((p) => p.productId);
            if (!this.roleForm.get("product")?.value && this.products.length) {
              this.roleForm.patchValue({ product: this.products[0] });
            }
          },
          error: (err) => {
            console.error("Failed to load products:", err);
            this.products = [];
          }
        });
      }
      createUser() {
        if (this.userForm.valid) {
          const realm = this.currentRealm || this.roleForm.get("realm")?.value;
          if (!realm) {
            alert("Please select a realm first");
            return;
          }
          const body = {
            username: this.userForm.value.username,
            email: this.userForm.value.email,
            firstName: this.userForm.value.firstName,
            lastName: this.userForm.value.lastName,
            enabled: true,
            emailVerified: true,
            credentials: [{ type: "password", value: this.userForm.value.password, temporary: false }]
          };
          this.apiGateway.createUser(realm, body).subscribe({
            next: () => {
              alert("\u2705 User created successfully");
              this.loadUsers();
              this.userForm.reset();
            },
            error: (err) => {
              console.error("\u274C Failed to create user", err);
              alert("Failed to create user: " + (err.error?.message || err.message || "Unknown error"));
            }
          });
        }
      }
      onEditUser(user) {
        this.editingUsername = user.username;
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: ""
        });
        this.userForm.get("username")?.disable();
        this.showEditModal = true;
      }
      closeEditModal() {
        this.showEditModal = false;
        this.userForm.reset();
        this.userForm.get("username")?.enable();
        this.editingUsername = null;
      }
      // ✅ DELETE USERs
      onDeleteUser(user) {
        const realm = this.currentRealm;
        if (!confirm(`Delete ${user.username}?`))
          return;
        this.keycloakService.deleteUser(realm, user.username).subscribe({
          next: () => {
            alert("\u2705 User deleted successfully");
            this.loadUsers();
          },
          error: () => alert("\u274C Delete failed")
        });
      }
      // Update user details emitted from UsersTab modals.
      updateUserFromModal(updatedData) {
        if (!updatedData?.username) {
          alert("No user selected for editing");
          return;
        }
        const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
        if (!realm) {
          alert("Realm not found");
          return;
        }
        const payload = {
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          email: updatedData.email,
          enabled: true
        };
        this.apiGateway.updateUser(realm, updatedData.username, payload).subscribe({
          next: () => {
            alert("\u2705 User updated successfully");
            this.loadUsers();
          },
          error: (err) => {
            console.error(err);
            alert("\u274C Update failed");
          }
        });
      }
      createProduct() {
        if (this.productForm.valid) {
          const realm = this.currentRealm || this.roleForm.get("realm")?.value;
          if (!realm) {
            alert("Please select a realm first");
            return;
          }
          const form = this.productForm.value;
          const body = {
            productId: form.clientId,
            publicClient: form.publicClient,
            rootUrl: form.rootUrl,
            baseUrl: form.rootUrl,
            redirectUris: form.redirectUris ? form.redirectUris.split(",").map((s) => s.trim()) : [],
            webOrigins: form.webOrigins ? form.webOrigins.split(",").map((s) => s.trim()) : []
          };
          this.apiGateway.createProduct(realm, body).subscribe({
            next: () => {
              alert("\u2705 Product created successfully");
              this.loadProducts();
              this.productForm.reset({ publicClient: true, redirectUris: "*", webOrigins: "*" });
            },
            error: (err) => {
              console.error("\u274C Failed to create product", err);
              alert("Failed to create product: " + (err.error?.message || err.message || "Unknown error"));
            }
          });
        }
      }
      createRole() {
        const form = this.roleForm.getRawValue();
        if (!form.client || !form.roleName) {
          alert("Client and Role Name are required");
          return;
        }
        const realm = form.realm || this.currentRealm;
        this.keycloakService.createRoleOnly(realm, form.client, form.roleName, form.description || "").subscribe({
          next: () => {
            alert("\u2705 Role created successfully");
            this.loadRoles();
            this.roleForm.patchValue({
              roleName: "",
              description: ""
            });
          },
          error: (err) => {
            console.error(err);
            alert("\u274C Role creation failed");
          }
        });
      }
      saveRolePermissions() {
        const form = this.roleForm.getRawValue();
        if (!form.product || !form.selectedRole) {
          alert("Please select product and role");
          return;
        }
        const realm = this.currentRealm || form.realm;
        const urls = form.urlUriPairs.filter((p) => p.url && p.uri && p.httpMethod);
        if (urls.length === 0) {
          alert("Add at least one URL permission");
          return;
        }
        this.keycloakService.saveRoleUrls(realm, form.product, form.selectedRole, urls).subscribe({
          next: () => {
            alert("\u2705 Permissions saved successfully");
          },
          error: (err) => {
            console.error(err);
            alert("\u274C Failed to save permissions");
          }
        });
      }
      addRoleToAssignment(roleName) {
        if (!roleName)
          return;
        const control = this.assignForm.get("roleName");
        if (control) {
          const currentRoles = control.value;
          if (!currentRoles.includes(roleName)) {
            control.setValue([...currentRoles, roleName]);
          }
        }
      }
      removeRoleFromAssignment(roleNameToRemove) {
        const control = this.assignForm.get("roleName");
        if (control) {
          const currentRoles = control.value;
          control.setValue(currentRoles.filter((r) => r !== roleNameToRemove));
        }
      }
      assignRole() {
        if (this.assignForm.valid) {
          const realm = this.currentRealm || this.roleForm.get("realm")?.value;
          if (!realm) {
            alert("Please select a realm first");
            return;
          }
          const { userId, product, roleName } = this.assignForm.value;
          const user = this.users.find((u) => u.id === userId);
          if (!user || !user.username) {
            alert("User not found or username missing");
            return;
          }
          const roles = Array.isArray(roleName) ? roleName : [roleName];
          this.keycloakService.assignRole(realm, user.username, product, roles).subscribe({
            next: () => {
              alert("\u2705 Roles assigned successfully");
              this.assignForm.reset();
            },
            error: (err) => {
              console.error("\u274C Failed to assign roles", err);
              alert("Failed to assign roles: " + (err.error?.message || err.message || "Unknown error"));
            }
          });
        }
      }
      logout() {
        this.keycloakService.logout();
      }
      // Test Access Methods
      loadTokenInfo(token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          this.tokenInfo = {
            realm: payload.realm || payload.iss?.split("/realms/")[1] || "",
            product: payload.product || payload.azp || "",
            roles: this.extractRolesFromToken(payload)
          };
        } catch (e) {
          console.warn("Could not extract token info");
          this.tokenInfo = null;
        }
      }
      extractRolesFromToken(payload) {
        const roles = [];
        if (payload.realm_access?.roles) {
          roles.push(...payload.realm_access.roles);
        }
        if (payload.resource_access) {
          Object.keys(payload.resource_access).forEach((clientId) => {
            const clientRoles = payload.resource_access[clientId]?.roles;
            if (clientRoles && Array.isArray(clientRoles)) {
              roles.push(...clientRoles);
            }
          });
        }
        return [...new Set(roles)];
      }
      testAccess() {
        if (this.testAccessForm.invalid) {
          return;
        }
        const token = getStoredToken();
        if (!token) {
          alert("No authentication token found. Please login first.");
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
            next: (response) => {
              this.testingAccess = false;
              const isAllowed = typeof response === "boolean" ? response : response.allowed || response;
              this.testResult = {
                allowed: isAllowed,
                testedUrl: testUrl,
                method,
                userRoles: this.tokenInfo?.roles || [],
                matchedRole: response.matchedRole || null,
                allowedUrls: response.allowedUrls || [],
                message: response.message || (isAllowed ? "You have access to this URL/URI" : "You do not have access to this URL/URI"),
                responseData: response.responseData || null,
                statusCode: response.statusCode || null
              };
            },
            error: (err) => {
              this.testingAccess = false;
              console.error("\u274C Error testing access", err);
              this.testResult = {
                allowed: false,
                testedUrl: testUrl,
                method,
                userRoles: this.tokenInfo?.roles || [],
                message: "Error testing access: " + (err.error?.message || err.message || "Unknown error"),
                error: err
              };
            }
          });
        }
      }
      makeActualHttpRequest(token, url, method) {
        this.keycloakService.makeHttpRequest(token, url, method).subscribe({
          next: (response) => {
            this.testingAccess = false;
            this.testResult = {
              allowed: true,
              testedUrl: url,
              method,
              userRoles: this.tokenInfo?.roles || [],
              message: `\u2705 Successfully accessed ${url} via ${method}`,
              responseData: response.data || response,
              statusCode: response.statusCode || 200,
              actualRequest: true
            };
          },
          error: (err) => {
            this.testingAccess = false;
            const statusCode = err.status || err.statusCode || 0;
            const isAccessDenied = statusCode === 403 || statusCode === 401;
            this.testResult = {
              allowed: false,
              testedUrl: url,
              method,
              userRoles: this.tokenInfo?.roles || [],
              message: isAccessDenied ? `\u274C Access Denied (${statusCode})` : `\u274C Request Failed: ${err.error?.message || err.message || "Unknown error"} (${statusCode})`,
              statusCode,
              error: err.error || err.message,
              actualRequest: true
            };
          }
        });
      }
      clearTestResult() {
        this.testResult = null;
      }
      // OpenAPI Spec Methods
      onOpenApiFileSelected(event) {
        const file = event.target.files?.[0];
        if (!file)
          return;
        this.openApiFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target.result;
            let spec;
            if (file.name.endsWith(".json")) {
              spec = JSON.parse(content);
            } else if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
              try {
                spec = JSON.parse(content);
              } catch {
                alert("YAML parsing not fully supported. Please use JSON format or install a YAML parser.");
                return;
              }
            } else {
              alert("Unsupported file format. Please use .json or .yaml/.yml");
              return;
            }
            this.parseOpenApiSpec(spec);
          } catch (error) {
            console.error("Error parsing OpenAPI spec:", error);
            alert("Error parsing OpenAPI spec: " + error.message);
          }
        };
        reader.readAsText(file);
      }
      parseOpenApiSpec(spec) {
        this.openApiEndpoints = [];
        if (spec.servers && spec.servers.length > 0) {
          this.openApiBaseUrl = spec.servers[0].url || "";
        } else if (spec.host) {
          const scheme = spec.schemes?.[0] || "https";
          this.openApiBaseUrl = `${scheme}://${spec.host}${spec.basePath || ""}`;
        }
        if (!spec.paths) {
          alert("No paths found in OpenAPI spec");
          return;
        }
        const httpMethods = ["get", "post", "put", "delete", "patch", "head", "options"];
        Object.keys(spec.paths).forEach((path) => {
          const pathItem = spec.paths[path];
          httpMethods.forEach((method) => {
            if (pathItem[method]) {
              const operation = pathItem[method];
              this.openApiEndpoints.push({
                method: method.toUpperCase(),
                path,
                summary: operation.summary,
                description: operation.description,
                selected: true
                // Select all by default
              });
            }
          });
        });
        if (this.openApiEndpoints.length === 0) {
          alert("No endpoints found in OpenAPI spec");
        } else {
          if (!this.openApiBaseUrl) {
            const userUrl = prompt("Enter the base URL for these endpoints (e.g., http://localhost:8083):");
            if (userUrl) {
              this.openApiBaseUrl = userUrl;
            }
          }
        }
      }
      toggleEndpointSelection(index) {
        this.openApiEndpoints[index].selected = !this.openApiEndpoints[index].selected;
      }
      selectAllEndpoints() {
        this.openApiEndpoints.forEach((endpoint) => endpoint.selected = true);
      }
      deselectAllEndpoints() {
        this.openApiEndpoints.forEach((endpoint) => endpoint.selected = false);
      }
      loadSelectedEndpointsToForm() {
        const selectedEndpoints = this.openApiEndpoints.filter((e) => e.selected);
        if (selectedEndpoints.length === 0) {
          alert("Please select at least one endpoint");
          return;
        }
        if (!this.openApiBaseUrl) {
          alert("Base URL is required.");
          return;
        }
        this.urlUriPairs.clear();
        selectedEndpoints.forEach((endpoint) => {
          const urlUriPair = this.createUrlUriPair();
          urlUriPair.patchValue({
            url: this.openApiBaseUrl,
            uri: endpoint.path,
            httpMethod: endpoint.method
            // ✅ now included
          });
          this.urlUriPairs.push(urlUriPair);
        });
        alert(`\u2705 Loaded ${selectedEndpoints.length} endpoint(s) with HTTP methods`);
      }
      clearOpenApiData() {
        this.openApiFile = null;
        this.openApiEndpoints = [];
        this.openApiBaseUrl = "";
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
      }
      static ctorParameters = () => [
        { type: KeycloakService },
        { type: ApiGatewayService },
        { type: FormBuilder },
        { type: ActivatedRoute },
        { type: Router }
      ];
    };
    User = __decorate([
      Component({
        selector: "app-user",
        standalone: true,
        imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          UsersTabComponent,
          RolesTabComponent,
          RoleUrlTabComponent
        ],
        template: user_default,
        styles: [user_default2]
      })
    ], User);
  }
});

// src/app/user/user.spec.ts
var require_user_spec = __commonJS({
  "src/app/user/user.spec.ts"(exports) {
    init_testing();
    init_http();
    init_router();
    init_esm();
    init_user3();
    describe("User", () => {
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        const routerEvents = new Subject();
        yield TestBed.configureTestingModule({
          imports: [User],
          providers: [
            provideHttpClient(),
            {
              provide: ActivatedRoute,
              useValue: {
                data: of({ section: "users" }),
                snapshot: { data: { section: "users" } },
                queryParamMap: of(convertToParamMap({}))
              }
            },
            {
              provide: Router,
              useValue: {
                url: "/dashboard/product/users",
                events: routerEvents.asObservable(),
                navigate: jasmine.createSpy("navigate")
              }
            }
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(User);
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(fixture.componentInstance).toBeTruthy();
      });
    });
  }
});
export default require_user_spec();
//# sourceMappingURL=spec-app-user-user.spec.js.map
