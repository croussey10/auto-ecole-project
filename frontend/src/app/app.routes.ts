import {Routes} from '@angular/router'
import {Login} from './features/public/login/login'
import {Register} from './features/public/register/register'
import {roleGuard} from './core/guards/role-guard';
import {DashboardEleve} from './features/eleve/dashboard-eleve/dashboard-eleve'
import {DashboardMoniteur} from './features/moniteur/dashboard-moniteur/dashboard-moniteur';

export const routes: Routes = [
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'auth/login/:schoolSlug', component: Login},
  {path: 'auth/register/:schoolSlug', component: Register},

  {
    path: 'eleve/dashboard',
    component: DashboardEleve,
    canActivate: [roleGuard],
    data: {roles: ['eleve']}
  },
  {
    path: 'moniteur/dashboard',
    component: DashboardMoniteur,
    canActivate: [roleGuard],
    data: {roles: ['moniteur']}
  },
]
