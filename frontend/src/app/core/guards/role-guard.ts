import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { ProfileService } from '../services/auth/profile-service'
import { AuthService } from '../services/auth/auth-service'

export const roleGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService)
  const authService = inject(AuthService)
  const router = inject(Router)

  let profile = profileService.currentProfile()

  if (!profile) {
    const user = await authService.loadCurrentUser()

    if (user) {
      let autoEcoleId = localStorage.getItem('activeAutoEcoleId')

      if (!autoEcoleId) {
        try {
          const backupProfile = await profileService.getFirstProfile(user.id)
          if (backupProfile) {
            autoEcoleId = backupProfile.auto_ecole_id
            localStorage.setItem('activeAutoEcoleId', autoEcoleId)
          }
        } catch (error) {}
      }

      if (autoEcoleId) {
        try {
          profile = await profileService.getProfileInfos(user.id, 'user', autoEcoleId)
          profileService.currentProfile.set(profile)
        } catch (error) {
          console.error('Erreur de récupération BDD:', error)
        }
      }
    }
  }

  if (!profile) {
    const slug = localStorage.getItem('activeAutoEcoleSlug')
    if (slug) return router.parseUrl(`/auth/login/${slug}`)
    return router.parseUrl('/ecole-introuvable')
  }

  const allowedRoles = route.data['roles']
  if (allowedRoles?.includes(profile.role)) {
    return true
  }

  return router.parseUrl(`/${profile.role}/dashboard`)
}
