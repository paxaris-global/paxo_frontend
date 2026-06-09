import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup,FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-users-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users-tab.component.html',
  styleUrls: ['../user.css', './users-tab.component.css'],
})
export class UsersTabComponent {

  @Input() currentRealm = '';
  @Input() users: any[] = [];
  @Input() userForm!: FormGroup;

  @Output() createUser = new EventEmitter<void>();
  @Output() deleteUser = new EventEmitter<any>();
  @Output() updateUser = new EventEmitter<any>();

  showEditModal = false;
  editingUser: any = null;

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
    });
  }

  openEditModal(user: any): void {
    this.editingUser = user;
    this.showEditModal = true;

    this.editForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  }

  closeModal(): void {
    this.showEditModal = false;
    this.editingUser = null;
  }

  saveEdit(): void {
    if (this.editForm.invalid) return;

    const updatedData = {
      username: this.editingUser.username,
      email: this.editForm.value.email,
      firstName: this.editForm.value.firstName,
      lastName: this.editForm.value.lastName
    };

    this.updateUser.emit(updatedData);
    this.closeModal();
  }
}