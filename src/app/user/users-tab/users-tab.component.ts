import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';

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
}
