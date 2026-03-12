import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/**
 * Product area wrapper: hosts child routes (products, users) and loads them as separate components.
 * URLs: dashboard/product/products, dashboard/product/users
 */
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [`:host { display: block; }`],
})
export class ProductComponent {}
