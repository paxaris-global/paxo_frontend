import { Routes } from '@angular/router';
import { LoginPage } from './login/login';
import { SignupPage } from './signup-page/signup-page';
import { DashboardComponent } from './dashboard/dashboard';
import { ProductComponent } from './product/product.component';
import { CreateProductComponent } from './create-product/create-product';
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
        path: 'product',
        component: ProductComponent,
        children: [
          { path: 'products', component: CreateProductComponent },
          { path: 'users', component: User, data: { section: 'users' } },
          { path: 'roles', component: User, data: { section: 'roles' } },
          { path: 'roleUrl', component: User, data: { section: 'roleUrl' } },
          { path: 'assign-roles', component: User, data: { section: 'assign' } },
          { path: '', redirectTo: 'products', pathMatch: 'full' }
        ]
      },
      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'product/products', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
