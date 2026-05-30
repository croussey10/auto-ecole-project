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
    provideAppInitializer(() => inject(AuthService).loadCurrentUser()),
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
