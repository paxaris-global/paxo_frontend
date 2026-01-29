import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-roles-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles-tab.component.html',
  styleUrls: ['../user.css', './roles-tab.component.css'],
})
export class RolesTabComponent {
  @Input() roleForm!: FormGroup;
  @Input() clients: string[] = [];
  @Input() roles: any[] = [];
  @Input() openApiEndpoints: Array<{
    method: string;
    path: string;
    summary?: string;
    description?: string;
    selected: boolean;
  }> = [];

  @Output() createRole = new EventEmitter<void>();
  @Output() loadRoles = new EventEmitter<void>();
  @Output() addUrlUriPair = new EventEmitter<void>();
  @Output() removeUrlUriPair = new EventEmitter<number>();
  @Output() openApiFileSelected = new EventEmitter<Event>();
  @Output() toggleEndpointSelection = new EventEmitter<number>();
  @Output() selectAllEndpoints = new EventEmitter<void>();
  @Output() deselectAllEndpoints = new EventEmitter<void>();
  @Output() loadSelectedEndpointsToForm = new EventEmitter<void>();
  @Output() clearOpenApiData = new EventEmitter<void>();

  get urlUriPairs(): FormArray {
    return this.roleForm?.get('urlUriPairs') as FormArray;
  }
}
