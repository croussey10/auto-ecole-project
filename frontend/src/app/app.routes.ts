import { Routes } from '@angular/router'
import { Login } from './features/public/login/login'
import { Register } from './features/public/register/register'
import { roleGuard } from './core/guards/role-guard'
import { EleveDashboard } from './features/eleve/eleve-dashboard/eleve-dashboard'
import { MoniteurDashboard } from './features/moniteur/moniteur-dashboard/moniteur-dashboard'
import { EcoleIntrouvable } from './features/public/ecole-introuvable/ecole-introuvable'
import { schoolGuard } from './core/guards/school-guard'

export const routes: Routes = [
  { path: '', redirectTo: 'ecole-introuvable', pathMatch: 'full' },
  { path: 'auth/login/:schoolSlug', component: Login, canActivate: [schoolGuard] },
  { path: 'auth/register/:schoolSlug', component: Register, canActivate: [schoolGuard] },
  { path: 'ecole-introuvable', component: EcoleIntrouvable },

  {
    path: 'eleve/dashboard',
    component: EleveDashboard,
    canActivate: [roleGuard],
    data: { roles: ['eleve'] },
  },
  {
    path: 'moniteur/dashboard',
    component: MoniteurDashboard,
    canActivate: [roleGuard],
    data: { roles: ['moniteur'] },
  },
]
