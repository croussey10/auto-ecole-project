import { Component, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { toSignal } from '@angular/core/rxjs-interop'
import { NgOptimizedImage } from '@angular/common'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { Button } from 'primeng/button'
import { Drawer } from 'primeng/drawer'
import { AuthService } from '../../../core/services/auth/auth-service'
import { AutoEcoleService } from '../../../core/services/database/auto-ecole-service'

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, Button, Drawer],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  autoEcoleService = inject(AutoEcoleService)
  profileService = inject(ProfileService)
  authService = inject(AuthService)
  router = inject(Router)
  breakPointObserver = inject(BreakpointObserver)

  autoEcoleSlug = localStorage.getItem('activeAutoEcoleSlug')

  breakpointMobile = toSignal(this.breakPointObserver.observe(Breakpoints.Handset))
  isMobile = computed(() => (this.breakpointMobile()?.matches ? true : false))

  visibleDrawer = signal<boolean>(false)

  onglets = [
    { label: 'Calendrier', icon: 'pi pi-calendar' },
    { label: 'Mes heures', icon: 'pi pi-clock' },
    { label: "Livret d'apprentissage", icon: 'pi pi-book' },
    { label: 'Mon compte', icon: 'pi pi-user' },
    { label: 'Achats', icon: 'pi pi-wallet' },
  ]

  async logout() {
    const profile = this.profileService.currentProfile()
    if (!profile) return
    const school = await this.autoEcoleService.getAutoEcoleInfos(profile.auto_ecole_id, 'id')
    await this.authService.logout()
    void this.router.navigate([`auth/login/${school.slug}`])
  }
}
