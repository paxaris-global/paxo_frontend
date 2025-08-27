
import { Routes } from '@angular/router';
import { SignupPage } from './signup-page/signup-page';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupPage }
];
