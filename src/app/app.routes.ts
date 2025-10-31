import { Routes } from '@angular/router';
import { LoginPage } from './login/login';
import { SignupPage } from './signup-page/signup-page';
import { User } from './user/user';
import { Settings } from './settings/settings';
import { CreateClientComponent } from './create-client/create-client';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignupPage },
  {
    path: 'dashboard',
    component: User, // this is your main dashboard shell
    children: [
      { path: 'clients', component: CreateClientComponent },
      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'clients', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
