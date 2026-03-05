import { Routes } from '@angular/router';
import { LoginPage } from './login/login';
import { SignupPage } from './signup-page/signup-page';
import { DashboardComponent } from './dashboard/dashboard';
import { CreateClientComponent } from './create-client/create-client';
import { User } from './user/user';
import { Settings } from './settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignupPage },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'clients', component: CreateClientComponent },
      { path: 'users', component: User },
      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'clients', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
