import { Component, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { toSignal } from '@angular/core/rxjs-interop'
import { NgOptimizedImage } from '@angular/common'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { Button } from 'primeng/button'
import { Drawer } from 'primeng/drawer'
import { AuthService } from '../../../core/services/auth/auth-service'

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, Button, Drawer],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  profileService = inject(ProfileService)
  authService = inject(AuthService)
  router = inject(Router)
  breakPointObserver = inject(BreakpointObserver)

  profile = this.profileService.currentProfile
  slug = this.profileService.activeAutoEcoleSlug

  breakpointMobile = toSignal(this.breakPointObserver.observe(Breakpoints.Handset))
  isMobile = computed(() => (this.breakpointMobile()?.matches ? true : false))

  visibleDrawer = signal<boolean>(false)

  onglets = computed(() => {
    const profileRole = this.profile()?.role
    if (!profileRole) return []
    const menu = [
      { label: 'Calendrier', icon: 'pi pi-calendar', link: `${profileRole}/calendar` },
      { label: 'Mes heures', icon: 'pi pi-clock', link: `${profileRole}/reservations` },
      { label: 'Mon compte', icon: 'pi pi-user', link: `${profileRole}/compte` },
      { label: 'Dashboard', icon: 'pi pi-globe', link: `${profileRole}/dashboard` },
    ]

    if (profileRole == 'eleve') {
      menu.push(
        { label: "Livret d'apprentissage", icon: 'pi pi-book', link: `${profileRole}/livret-apprentissage` },
        { label: 'Forfaits', icon: 'pi pi-wallet', link: `${profileRole}/forfaits` },
        { label: 'Achats', icon: 'pi pi-wallet', link: `${profileRole}/achats` },
      )
    } else if (profileRole == 'moniteur') {
      menu.push({ label: 'Eleves', icon: 'pi pi-users', link: `${profileRole}/eleves` })
    }

    return menu
  })

  async logout() {
    await this.authService.logout()
    void this.router.navigate([`auth/login/${this.slug()}`])
  }
}
