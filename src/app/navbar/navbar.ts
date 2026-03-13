import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { clearAuthState, isLoggedIn } from '../auth-storage';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  get loggedIn(): boolean {
    return isLoggedIn();
  }

  logout($event: Event): void {
    $event.preventDefault();
    clearAuthState();
    this.router.navigate(['/login']);
  }
}
