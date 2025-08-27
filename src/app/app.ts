import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupPage } from './signup-page/signup-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignupPage],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('keycloak_client_frontend');
}
