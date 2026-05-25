import { Routes } from '@angular/router';
import {Login} from './features/public/login/login';
import {Register} from './features/public/register/register';
import {DashboardEleve} from './features/eleve/dashboard-eleve/dashboard-eleve';

export const routes: Routes = [
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'auth/login/:schoolSlug', component: Login},
  {path: 'auth/register/:schoolSlug', component: Register},

  {path: 'dashboard', component: DashboardEleve}
];
