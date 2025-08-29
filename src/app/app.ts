import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupPage } from './signup-page/signup-page';
import { User } from './user/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ SignupPage,User],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('keycloak_client_frontend');
}
