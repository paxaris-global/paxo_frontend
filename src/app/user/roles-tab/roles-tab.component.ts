import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductOption } from '../../models';

@Component({
  selector: 'app-roles-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles-tab.component.html',
  styleUrls: ['../user.css', './roles-tab.component.css'],
})
export class RolesTabComponent {
  @Input() roleForm!: FormGroup;
  @Input() products: ProductOption[] = [];
  @Input() roles: any[] = [];

  @Output() createRole = new EventEmitter<void>();
  @Output() updateRole = new EventEmitter<{
    product: string;
    originalName: string;
    name: string;
    description: string;
  }>();
  @Output() deleteRole = new EventEmitter<any>();

  showEditModal = false;
  editingRole: any = null;
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      product: [{ value: '', disabled: true }],
      originalName: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.createRole.emit();
  }

  openEditModal(role: any): void {
    this.editingRole = role;
    this.showEditModal = true;
    this.editForm.patchValue({
      product: role.product || '',
      originalName: role.name,
      name: role.name,
      description: role.description || '',
    });
  }

  closeModal(): void {
    this.showEditModal = false;
    this.editingRole = null;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.editingRole) return;

    const raw = this.editForm.getRawValue();
    this.updateRole.emit({
      product: raw.product || this.editingRole.product,
      originalName: raw.originalName || this.editingRole.name,
      name: raw.name,
      description: raw.description || '',
    });
    this.closeModal();
  }
}
