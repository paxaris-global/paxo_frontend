import { Routes } from '@angular/router';
import { LoginPage } from './login/login';
import { SignupPage } from './signup-page/signup-page';
import { DashboardComponent } from './dashboard/dashboard';
import { ClientComponent } from './client/client.component';
import { CreateClientComponent } from './create-client/create-client';
import { User } from './user/user';
import { Settings } from './settings/settings';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginPage, canActivate: [guestGuard] },
  { path: 'signup', component: SignupPage, canActivate: [guestGuard] },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'client',
        component: ClientComponent,
        children: [
          { path: 'products', component: CreateClientComponent },
          { path: 'users', component: User, data: { section: 'users' } },
          { path: 'roles', component: User, data: { section: 'roles' } },
          { path: 'roleUrl', component: User, data: { section: 'roleUrl' } },
          { path: 'assign-roles', component: User, data: { section: 'assign' } },
          { path: '', redirectTo: 'products', pathMatch: 'full' }
        ]
      },
      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'client/products', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
