import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
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

  onSubmit(event: Event) {
    event.preventDefault();   // 🔥 prevents reload
    this.createRole.emit();
  }
}
