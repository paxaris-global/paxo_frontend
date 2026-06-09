import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar'; // adjust path if needed
import { CommonModule } from '@angular/common';
import { SessionManagerService } from './services/session-manager.service';
import { StatusModalComponent } from './shared/components/status-modal/status-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, StatusModalComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-status-modal></app-status-modal>
  `,
  styles: [`
    
  `]
})
export class App {
  constructor(private readonly sessionManager: SessionManagerService) {
    this.sessionManager.start();
  }
}
