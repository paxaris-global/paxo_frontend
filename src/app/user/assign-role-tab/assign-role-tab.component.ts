import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { ProductOption } from '../../models';

@Component({
  selector: 'app-assign-role-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assign-role-tab.component.html',
  styleUrls: ['../user.css', './assign-role-tab.component.css'],
})
export class AssignRoleTabComponent {
  @Input() currentRealm = '';
  @Input() users: any[] = [];
  @Input() products: ProductOption[] = [];
  @Input() roles: any[] = [];
  @Input() selectedRoleNames: string[] = [];
  @Input() availableRolesForAssignment: any[] = [];
  @Input() assignForm!: FormGroup;
  @Input() canSubmitAssign = false;

  @Output() assignRole = new EventEmitter<void>();
  @Output() addRole = new EventEmitter<string>();
  @Output() removeRole = new EventEmitter<string>();
}
