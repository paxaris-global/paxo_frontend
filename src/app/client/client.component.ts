import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/**
 * Client area wrapper: hosts child routes (products, users) and loads them as separate components.
 * URLs: dashboard/client/products, dashboard/client/users
 */
@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [`:host { display: block; }`],
})
export class ClientComponent {}
