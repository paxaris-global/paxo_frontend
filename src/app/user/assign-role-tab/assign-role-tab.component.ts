import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { ProductOption } from '../../models';
import { getStoredRealm } from '../../auth-storage';

@Component({
  selector: 'app-assign-role-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assign-role-tab.component.html',
  styleUrls: ['../user.css', './assign-role-tab.component.css'],
})
export class AssignRoleTabComponent implements OnInit, OnDestroy {
  @Input() currentRealm = '';
  @Input() users: any[] = [];
  @Input() products: ProductOption[] = [];
  @Input() roles: any[] = [];
  @Input() selectedRoleNames: string[] = [];
  @Input() availableRolesForAssignment: any[] = [];
  @Input() assignForm!: FormGroup;

  @Output() assignRole = new EventEmitter<void>();
  @Output() addRole = new EventEmitter<string>();
  @Output() removeRole = new EventEmitter<string>();

  /** Updated on every assignForm change so the submit button enables immediately. */
  canSubmit = false;

  private formSub?: Subscription;

  ngOnInit(): void {
    this.refreshCanSubmit();
    if (this.assignForm) {
      this.formSub = merge(
        this.assignForm.valueChanges,
        this.assignForm.statusChanges
      ).subscribe(() => this.refreshCanSubmit());
    }
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  onAssignClick(): void {
    if (this.canSubmit) {
      this.assignRole.emit();
    }
  }

  private refreshCanSubmit(): void {
    const realm = (this.currentRealm || getStoredRealm() || '').trim();
    if (!realm || !this.assignForm) {
      this.canSubmit = false;
      return;
    }

    const raw = this.assignForm.getRawValue() as {
      userId?: string;
      product?: string;
      roleName?: string[];
    };
    const userId = String(raw.userId ?? '').trim();
    const product = String(raw.product ?? '').trim();
    const roleNames = Array.isArray(raw.roleName)
      ? raw.roleName.filter((name) => typeof name === 'string' && name.trim().length > 0)
      : [];

    this.canSubmit = userId.length > 0 && product.length > 0 && roleNames.length > 0;
  }
}
