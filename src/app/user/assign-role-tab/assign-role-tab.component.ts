import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';

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
  @Input() clients: string[] = [];
  @Input() roles: any[] = [];
  @Input() assignForm!: FormGroup;

  @Output() assignRole = new EventEmitter<void>();
}
