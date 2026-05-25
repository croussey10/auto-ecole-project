import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfileRoutingService {
  router = inject(Router)

  redirectUrlByRole(role: string) {
    switch (role) {
      case 'eleve':
        console.log("eleve")
        void this.router.navigate(['dashboard'])
        break
      case 'moniteur':
        console.log("moniteur")
        break
      case 'admin':
        console.log("admin")
        break
      default:
        console.log("pas connecté")
    }
  }
}
