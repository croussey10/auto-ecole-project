import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { routes } from './app.routes'
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeuix/themes/aura'
import { MessageService } from 'primeng/api'
import { ProfileService } from './core/services/auth/profile-service'
import { AuthService } from './core/services/auth/auth-service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(initializeAuthAndProfile),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
  ],
}

async function initializeAuthAndProfile() {
  const authService = inject(AuthService)
  const profileService = inject(ProfileService)

  const user = await authService.loadCurrentUser()

  if (user) {
    const autoEcoleId = localStorage.getItem('activeAutoEcoleId')
    if (autoEcoleId) {
      try {
        const profile = await profileService.getProfileInfos(user.id, 'user', autoEcoleId)
        profileService.currentProfile.set(profile)
      } catch (error) {
        console.error('Erreur au chargement du profil au démarrage', error)
      }
    }
  }
}
