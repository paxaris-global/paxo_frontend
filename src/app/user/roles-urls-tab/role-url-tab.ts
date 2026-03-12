import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-role-url-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-url-tab.html',
  styleUrls: ['./role-url-tab.css']
})
export class RoleUrlTabComponent {
  @Input() roleForm!: FormGroup;
  @Input() products: any[] = [];
  @Input() roles: any[] = [];
  @Input() openApiEndpoints: any[] = [];

  @Output() addUrlUriPair = new EventEmitter<void>();
  @Output() removeUrlUriPair = new EventEmitter<number>();
  @Output() openApiFileSelected = new EventEmitter<any>();
  @Output() toggleEndpointSelection = new EventEmitter<number>();
  @Output() selectAllEndpoints = new EventEmitter<void>();
  @Output() deselectAllEndpoints = new EventEmitter<void>();
  @Output() savePermissions = new EventEmitter<void>();
  @Output() loadSelectedEndpoints = new EventEmitter<void>();
  @Output() clearOpenApi = new EventEmitter<void>();

  get urlUriPairs(): FormArray {
    return this.roleForm.get('urlUriPairs') as FormArray;
  }
}