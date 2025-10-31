import { Component } from '@angular/core';
import { SignupPage } from './signup-page/signup-page';
import { User } from './user/user';
import { LoginPage } from './login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SignupPage, User,LoginPage],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Identity Management Portal';
}
