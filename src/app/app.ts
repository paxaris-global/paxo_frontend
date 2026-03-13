import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar'; // adjust path if needed
import { CommonModule } from '@angular/common';
import { SessionManagerService } from './services/session-manager.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    
  `]
})
export class App {
  constructor(private readonly sessionManager: SessionManagerService) {
    this.sessionManager.start();
  }
}
