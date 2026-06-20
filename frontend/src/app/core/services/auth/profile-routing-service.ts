import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class ProfileRoutingService {
  router = inject(Router)

  redirectUrlByRole(role: string) {
    switch (role) {
      case 'eleve':
        console.log('eleve')
        void this.router.navigate(['eleve/dashboard'])
        break
      case 'moniteur':
        console.log('moniteur')
        void this.router.navigate(['moniteur/dashboard'])
        break
      case 'admin':
        console.log('admin')
        break
      default:
        console.log('pas connecté')
    }
  }
}
