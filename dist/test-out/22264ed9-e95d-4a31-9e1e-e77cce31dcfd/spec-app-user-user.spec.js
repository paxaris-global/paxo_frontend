import {
  endpointsToRoleUrlPayload,
  extractOpenApiBaseUrl,
  init_open_api_spec_util,
  parseOpenApiToEndpoints
} from "./chunk-PSWCIAID.js";
import {
  KeycloakService,
  init_keycloak
} from "./chunk-LZT5VLBC.js";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  init_forms
} from "./chunk-YUDCIBMT.js";
import {
  ApiGatewayService,
  init_api_gateway_service
} from "./chunk-WN5KO2DR.js";
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
import "./chunk-WICWKET6.js";
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
    (loadSelectedEndpointsAndSave)="loadSelectedEndpointsAndSave()"
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

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
function setProperty(object, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  } else {
    object[key] = value;
  }
}
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      setProperty(destination, key, source[key]);
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    setProperty(_result, keyNode, valueNode);
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity,
      state.quotingType,
      state.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  })();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = (function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  })();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(
        state.tag[0] === "!" ? state.tag.slice(1) : state.tag
      ).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var isNothing_1, isObject_1, toArray_1, repeat_1, isNegativeZero_1, extend_1, common, exception, snippet, TYPE_CONSTRUCTOR_OPTIONS, YAML_NODE_KINDS, type, schema, str, seq, map, failsafe, _null, bool, int, YAML_FLOAT_PATTERN, SCIENTIFIC_WITHOUT_DOT, float, json, core, YAML_DATE_REGEXP, YAML_TIMESTAMP_REGEXP, timestamp, merge, BASE64_MAP, binary, _hasOwnProperty$3, _toString$2, omap, _toString$1, pairs, _hasOwnProperty$2, set, _default, _hasOwnProperty$1, CONTEXT_FLOW_IN, CONTEXT_FLOW_OUT, CONTEXT_BLOCK_IN, CONTEXT_BLOCK_OUT, CHOMPING_CLIP, CHOMPING_STRIP, CHOMPING_KEEP, PATTERN_NON_PRINTABLE, PATTERN_NON_ASCII_LINE_BREAKS, PATTERN_FLOW_INDICATORS, PATTERN_TAG_HANDLE, PATTERN_TAG_URI, simpleEscapeCheck, simpleEscapeMap, i, directiveHandlers, loadAll_1, load_1, loader, _toString, _hasOwnProperty, CHAR_BOM, CHAR_TAB, CHAR_LINE_FEED, CHAR_CARRIAGE_RETURN, CHAR_SPACE, CHAR_EXCLAMATION, CHAR_DOUBLE_QUOTE, CHAR_SHARP, CHAR_PERCENT, CHAR_AMPERSAND, CHAR_SINGLE_QUOTE, CHAR_ASTERISK, CHAR_COMMA, CHAR_MINUS, CHAR_COLON, CHAR_EQUALS, CHAR_GREATER_THAN, CHAR_QUESTION, CHAR_COMMERCIAL_AT, CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_GRAVE_ACCENT, CHAR_LEFT_CURLY_BRACKET, CHAR_VERTICAL_LINE, CHAR_RIGHT_CURLY_BRACKET, ESCAPE_SEQUENCES, DEPRECATED_BOOLEANS_SYNTAX, DEPRECATED_BASE60_SYNTAX, QUOTING_TYPE_SINGLE, QUOTING_TYPE_DOUBLE, STYLE_PLAIN, STYLE_SINGLE, STYLE_LITERAL, STYLE_FOLDED, STYLE_DOUBLE, dump_1, dumper, load, loadAll, dump, safeLoad, safeLoadAll, safeDump;
var init_js_yaml = __esm({
  "node_modules/js-yaml/dist/js-yaml.mjs"() {
    "use strict";
    isNothing_1 = isNothing;
    isObject_1 = isObject;
    toArray_1 = toArray;
    repeat_1 = repeat;
    isNegativeZero_1 = isNegativeZero;
    extend_1 = extend;
    common = {
      isNothing: isNothing_1,
      isObject: isObject_1,
      toArray: toArray_1,
      repeat: repeat_1,
      isNegativeZero: isNegativeZero_1,
      extend: extend_1
    };
    YAMLException$1.prototype = Object.create(Error.prototype);
    YAMLException$1.prototype.constructor = YAMLException$1;
    YAMLException$1.prototype.toString = function toString(compact) {
      return this.name + ": " + formatError(this, compact);
    };
    exception = YAMLException$1;
    snippet = makeSnippet;
    TYPE_CONSTRUCTOR_OPTIONS = [
      "kind",
      "multi",
      "resolve",
      "construct",
      "instanceOf",
      "predicate",
      "represent",
      "representName",
      "defaultStyle",
      "styleAliases"
    ];
    YAML_NODE_KINDS = [
      "scalar",
      "sequence",
      "mapping"
    ];
    type = Type$1;
    Schema$1.prototype.extend = function extend2(definition) {
      var implicit = [];
      var explicit = [];
      if (definition instanceof type) {
        explicit.push(definition);
      } else if (Array.isArray(definition)) {
        explicit = explicit.concat(definition);
      } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
        if (definition.implicit) implicit = implicit.concat(definition.implicit);
        if (definition.explicit) explicit = explicit.concat(definition.explicit);
      } else {
        throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
      }
      implicit.forEach(function(type$1) {
        if (!(type$1 instanceof type)) {
          throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
        }
        if (type$1.loadKind && type$1.loadKind !== "scalar") {
          throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
        }
        if (type$1.multi) {
          throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
        }
      });
      explicit.forEach(function(type$1) {
        if (!(type$1 instanceof type)) {
          throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
        }
      });
      var result = Object.create(Schema$1.prototype);
      result.implicit = (this.implicit || []).concat(implicit);
      result.explicit = (this.explicit || []).concat(explicit);
      result.compiledImplicit = compileList(result, "implicit");
      result.compiledExplicit = compileList(result, "explicit");
      result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
      return result;
    };
    schema = Schema$1;
    str = new type("tag:yaml.org,2002:str", {
      kind: "scalar",
      construct: function(data) {
        return data !== null ? data : "";
      }
    });
    seq = new type("tag:yaml.org,2002:seq", {
      kind: "sequence",
      construct: function(data) {
        return data !== null ? data : [];
      }
    });
    map = new type("tag:yaml.org,2002:map", {
      kind: "mapping",
      construct: function(data) {
        return data !== null ? data : {};
      }
    });
    failsafe = new schema({
      explicit: [
        str,
        seq,
        map
      ]
    });
    _null = new type("tag:yaml.org,2002:null", {
      kind: "scalar",
      resolve: resolveYamlNull,
      construct: constructYamlNull,
      predicate: isNull,
      represent: {
        canonical: function() {
          return "~";
        },
        lowercase: function() {
          return "null";
        },
        uppercase: function() {
          return "NULL";
        },
        camelcase: function() {
          return "Null";
        },
        empty: function() {
          return "";
        }
      },
      defaultStyle: "lowercase"
    });
    bool = new type("tag:yaml.org,2002:bool", {
      kind: "scalar",
      resolve: resolveYamlBoolean,
      construct: constructYamlBoolean,
      predicate: isBoolean,
      represent: {
        lowercase: function(object) {
          return object ? "true" : "false";
        },
        uppercase: function(object) {
          return object ? "TRUE" : "FALSE";
        },
        camelcase: function(object) {
          return object ? "True" : "False";
        }
      },
      defaultStyle: "lowercase"
    });
    int = new type("tag:yaml.org,2002:int", {
      kind: "scalar",
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
        binary: function(obj) {
          return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
        },
        octal: function(obj) {
          return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
        },
        decimal: function(obj) {
          return obj.toString(10);
        },
        /* eslint-disable max-len */
        hexadecimal: function(obj) {
          return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
        }
      },
      defaultStyle: "decimal",
      styleAliases: {
        binary: [2, "bin"],
        octal: [8, "oct"],
        decimal: [10, "dec"],
        hexadecimal: [16, "hex"]
      }
    });
    YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
    );
    SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
    float = new type("tag:yaml.org,2002:float", {
      kind: "scalar",
      resolve: resolveYamlFloat,
      construct: constructYamlFloat,
      predicate: isFloat,
      represent: representYamlFloat,
      defaultStyle: "lowercase"
    });
    json = failsafe.extend({
      implicit: [
        _null,
        bool,
        int,
        float
      ]
    });
    core = json;
    YAML_DATE_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
    );
    YAML_TIMESTAMP_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
    );
    timestamp = new type("tag:yaml.org,2002:timestamp", {
      kind: "scalar",
      resolve: resolveYamlTimestamp,
      construct: constructYamlTimestamp,
      instanceOf: Date,
      represent: representYamlTimestamp
    });
    merge = new type("tag:yaml.org,2002:merge", {
      kind: "scalar",
      resolve: resolveYamlMerge
    });
    BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
    binary = new type("tag:yaml.org,2002:binary", {
      kind: "scalar",
      resolve: resolveYamlBinary,
      construct: constructYamlBinary,
      predicate: isBinary,
      represent: representYamlBinary
    });
    _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
    _toString$2 = Object.prototype.toString;
    omap = new type("tag:yaml.org,2002:omap", {
      kind: "sequence",
      resolve: resolveYamlOmap,
      construct: constructYamlOmap
    });
    _toString$1 = Object.prototype.toString;
    pairs = new type("tag:yaml.org,2002:pairs", {
      kind: "sequence",
      resolve: resolveYamlPairs,
      construct: constructYamlPairs
    });
    _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
    set = new type("tag:yaml.org,2002:set", {
      kind: "mapping",
      resolve: resolveYamlSet,
      construct: constructYamlSet
    });
    _default = core.extend({
      implicit: [
        timestamp,
        merge
      ],
      explicit: [
        binary,
        omap,
        pairs,
        set
      ]
    });
    _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
    CONTEXT_FLOW_IN = 1;
    CONTEXT_FLOW_OUT = 2;
    CONTEXT_BLOCK_IN = 3;
    CONTEXT_BLOCK_OUT = 4;
    CHOMPING_CLIP = 1;
    CHOMPING_STRIP = 2;
    CHOMPING_KEEP = 3;
    PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
    PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
    PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
    PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
    simpleEscapeCheck = new Array(256);
    simpleEscapeMap = new Array(256);
    for (i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }
    directiveHandlers = {
      YAML: function handleYamlDirective(state, name, args) {
        var match, major, minor;
        if (state.version !== null) {
          throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
          throwError(state, "YAML directive accepts exactly one argument");
        }
        match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
          throwError(state, "ill-formed argument of the YAML directive");
        }
        major = parseInt(match[1], 10);
        minor = parseInt(match[2], 10);
        if (major !== 1) {
          throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
          throwWarning(state, "unsupported YAML version of the document");
        }
      },
      TAG: function handleTagDirective(state, name, args) {
        var handle, prefix;
        if (args.length !== 2) {
          throwError(state, "TAG directive accepts exactly two arguments");
        }
        handle = args[0];
        prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
          throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (_hasOwnProperty$1.call(state.tagMap, handle)) {
          throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
          throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        try {
          prefix = decodeURIComponent(prefix);
        } catch (err) {
          throwError(state, "tag prefix is malformed: " + prefix);
        }
        state.tagMap[handle] = prefix;
      }
    };
    loadAll_1 = loadAll$1;
    load_1 = load$1;
    loader = {
      loadAll: loadAll_1,
      load: load_1
    };
    _toString = Object.prototype.toString;
    _hasOwnProperty = Object.prototype.hasOwnProperty;
    CHAR_BOM = 65279;
    CHAR_TAB = 9;
    CHAR_LINE_FEED = 10;
    CHAR_CARRIAGE_RETURN = 13;
    CHAR_SPACE = 32;
    CHAR_EXCLAMATION = 33;
    CHAR_DOUBLE_QUOTE = 34;
    CHAR_SHARP = 35;
    CHAR_PERCENT = 37;
    CHAR_AMPERSAND = 38;
    CHAR_SINGLE_QUOTE = 39;
    CHAR_ASTERISK = 42;
    CHAR_COMMA = 44;
    CHAR_MINUS = 45;
    CHAR_COLON = 58;
    CHAR_EQUALS = 61;
    CHAR_GREATER_THAN = 62;
    CHAR_QUESTION = 63;
    CHAR_COMMERCIAL_AT = 64;
    CHAR_LEFT_SQUARE_BRACKET = 91;
    CHAR_RIGHT_SQUARE_BRACKET = 93;
    CHAR_GRAVE_ACCENT = 96;
    CHAR_LEFT_CURLY_BRACKET = 123;
    CHAR_VERTICAL_LINE = 124;
    CHAR_RIGHT_CURLY_BRACKET = 125;
    ESCAPE_SEQUENCES = {};
    ESCAPE_SEQUENCES[0] = "\\0";
    ESCAPE_SEQUENCES[7] = "\\a";
    ESCAPE_SEQUENCES[8] = "\\b";
    ESCAPE_SEQUENCES[9] = "\\t";
    ESCAPE_SEQUENCES[10] = "\\n";
    ESCAPE_SEQUENCES[11] = "\\v";
    ESCAPE_SEQUENCES[12] = "\\f";
    ESCAPE_SEQUENCES[13] = "\\r";
    ESCAPE_SEQUENCES[27] = "\\e";
    ESCAPE_SEQUENCES[34] = '\\"';
    ESCAPE_SEQUENCES[92] = "\\\\";
    ESCAPE_SEQUENCES[133] = "\\N";
    ESCAPE_SEQUENCES[160] = "\\_";
    ESCAPE_SEQUENCES[8232] = "\\L";
    ESCAPE_SEQUENCES[8233] = "\\P";
    DEPRECATED_BOOLEANS_SYNTAX = [
      "y",
      "Y",
      "yes",
      "Yes",
      "YES",
      "on",
      "On",
      "ON",
      "n",
      "N",
      "no",
      "No",
      "NO",
      "off",
      "Off",
      "OFF"
    ];
    DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
    QUOTING_TYPE_SINGLE = 1;
    QUOTING_TYPE_DOUBLE = 2;
    STYLE_PLAIN = 1;
    STYLE_SINGLE = 2;
    STYLE_LITERAL = 3;
    STYLE_FOLDED = 4;
    STYLE_DOUBLE = 5;
    dump_1 = dump$1;
    dumper = {
      dump: dump_1
    };
    load = loader.load;
    loadAll = loader.loadAll;
    dump = dumper.dump;
    safeLoad = renamed("safeLoad", "load");
    safeLoadAll = renamed("safeLoadAll", "loadAll");
    safeDump = renamed("safeDump", "dump");
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
    role_url_tab_default = '<div class="role-url-tab" [formGroup]="roleForm">\n  <h3>Configure Role URLs</h3>\n\n  <div class="form-row" style="display: flex; gap: 20px; margin-bottom: 20px;">\n    <div class="form-group" style="flex: 1;">\n      <label>Product</label>\n      <select formControlName="product" class="form-control">\n        <option value="" disabled>Select Product</option>\n        <option *ngFor="let product of products" [value]="product">\n          {{ product }}\n        </option>\n      </select>\n    </div>\n\n    <div class="form-group" style="flex: 1;">\n      <label>Role</label>\n      <select formControlName="selectedRole" class="form-control">\n        <option value="" disabled>Select Role</option>\n        <option *ngFor="let role of roles" [value]="role.name">\n          {{ role.name }}\n        </option>\n      </select>\n    </div>\n  </div>\n\n  <hr />\n\n  <!-- OpenAPI Section -->\n  <div class="openapi-section" style="margin-bottom: 20px;">\n    <h4>Import from OpenAPI (Optional)</h4>\n    <div class="file-input-row" style="margin-bottom: 10px;">\n      <input type="file" (change)="openApiFileSelected.emit($event)" accept=".json,.yaml,.yml" />\n      <button type="button" (click)="clearOpenApi.emit()" *ngIf="openApiEndpoints.length > 0">Clear</button>\n    </div>\n\n    <div *ngIf="openApiEndpoints.length > 0" class="endpoints-list" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;">\n      <div class="actions" style="margin-bottom: 10px;">\n        <button type="button" (click)="selectAllEndpoints.emit()">Select All</button>\n        <button type="button" (click)="deselectAllEndpoints.emit()">Deselect All</button>\n        <button type="button" (click)="loadSelectedEndpoints.emit()" class="primary">Load Selected to Form</button>\n        <button type="button" (click)="loadSelectedEndpointsAndSave.emit()" class="primary">\n          Load Selected &amp; Save to Role\n        </button>\n      </div>\n      <div class="endpoint-item" *ngFor="let endpoint of openApiEndpoints; let i = index">\n        <label>\n          <input type="checkbox" [checked]="endpoint.selected" (change)="toggleEndpointSelection.emit(i)" />\n          <strong>{{ endpoint.method }}</strong> {{ endpoint.path }}\n          <span *ngIf="endpoint.summary" style="color: #666;">- {{ endpoint.summary }}</span>\n        </label>\n      </div>\n    </div>\n  </div>\n\n  <hr />\n\n  <!-- URL/URI Pairs -->\n  <h4>URL Permissions</h4>\n  <div formArrayName="urlUriPairs">\n    <div *ngFor="let pair of urlUriPairs.controls; let i = index" [formGroupName]="i" class="url-pair-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-end;">\n      <div class="form-group">\n        <label>Method</label>\n        <select formControlName="httpMethod" class="form-control">\n          <option value="GET">GET</option>\n          <option value="POST">POST</option>\n          <option value="PUT">PUT</option>\n          <option value="DELETE">DELETE</option>\n          <option value="PATCH">PATCH</option>\n          <option value="*">*</option>\n        </select>\n      </div>\n      <div class="form-group" style="flex: 1;">\n        <label>URL (Base)</label>\n        <input formControlName="url" class="form-control" placeholder="http://localhost:8080" />\n      </div>\n      <div class="form-group" style="flex: 1;">\n        <label>URI (Path)</label>\n        <input formControlName="uri" class="form-control" placeholder="/api/resource" />\n      </div>\n      <button type="button" class="remove-btn" (click)="removeUrlUriPair.emit(i)" *ngIf="urlUriPairs.length > 1" style="margin-bottom: 2px;">\n        <i class="fa fa-trash"></i> Remove\n      </button>\n    </div>\n  </div>\n\n  <div class="actions-row" style="margin-top: 20px;">\n    <button type="button" (click)="addUrlUriPair.emit()">+ Add URL</button>\n    <button type="button" class="save-btn" (click)="savePermissions.emit()" style="margin-left: 10px;">Save Permissions</button>\n  </div>\n</div>';
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
      loadSelectedEndpointsAndSave = new EventEmitter();
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
        loadSelectedEndpointsAndSave: [{ type: Output }],
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
    init_js_yaml();
    init_open_api_spec_util();
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
              const doc = load(content);
              if (doc == null || typeof doc !== "object") {
                alert("Invalid OpenAPI YAML (empty or not an object).");
                return;
              }
              spec = doc;
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
        if (!spec || typeof spec !== "object") {
          alert("Invalid OpenAPI spec");
          return;
        }
        const rec = spec;
        if (!rec["paths"]) {
          alert("No paths found in OpenAPI spec");
          return;
        }
        this.openApiBaseUrl = extractOpenApiBaseUrl(rec);
        this.openApiEndpoints = parseOpenApiToEndpoints(rec);
        if (this.openApiEndpoints.length === 0) {
          alert("No endpoints found in OpenAPI spec");
        } else if (!this.openApiBaseUrl) {
          const userUrl = prompt("Enter the base URL for these endpoints (e.g., http://localhost:8083):");
          if (userUrl) {
            this.openApiBaseUrl = userUrl;
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
      /** Apply selected OpenAPI operations and POST them to project-manager (same as filling the form + Save). */
      loadSelectedEndpointsAndSave() {
        const selectedEndpoints = this.openApiEndpoints.filter((e) => e.selected);
        if (selectedEndpoints.length === 0) {
          alert("Please select at least one endpoint");
          return;
        }
        if (!this.openApiBaseUrl?.trim()) {
          alert("Base URL is required (from OpenAPI servers[] or enter when prompted).");
          return;
        }
        const realm = this.currentRealm || this.roleForm.getRawValue()?.realm;
        const product = this.roleForm.getRawValue()?.product;
        const selectedRole = this.roleForm.getRawValue()?.selectedRole;
        if (!realm || !product || !selectedRole) {
          alert("Please select product and role first.");
          return;
        }
        const urls = endpointsToRoleUrlPayload(selectedEndpoints, this.openApiBaseUrl);
        this.keycloakService.saveRoleUrls(realm, product, selectedRole, urls).subscribe({
          next: () => alert(`Saved ${selectedEndpoints.length} URI(s) for role "${selectedRole}" from OpenAPI.`),
          error: (err) => {
            console.error(err);
            alert("Failed to save permissions: " + (err.error?.message || err.message || "Unknown error"));
          }
        });
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
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/
//# sourceMappingURL=spec-app-user-user.spec.js.map
