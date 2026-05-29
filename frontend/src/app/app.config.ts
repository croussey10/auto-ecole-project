import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { routes } from './app.routes'
import { AuthService } from './core/services/auth/auth-service'
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeuix/themes/aura'
import { MessageService } from 'primeng/api'
import {initializeApp} from './core/services/auth/app-init';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideAppInitializer(() => inject(AuthService).loadCurrentUser()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true
    },
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
