import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { AutoEcoleService } from '../services/database/auto-ecole-service'

export const schoolGuard: CanActivateFn = async (route, state) => {
  const autoEcoleService = inject(AutoEcoleService)
  const router = inject(Router)

  const slug = route.params['schoolSlug']

  if (!slug) {
    return router.parseUrl('/ecole-introuvable')
  }
  try {
    const autoEcole = await autoEcoleService.getAutoEcoleInfos(slug, 'slug')
    if (!autoEcole) {
      return router.parseUrl('/ecole-introuvable')
    }
    return true
  } catch (error) {
    console.error(error)
    return router.parseUrl('/ecole-introuvable')
  }
}
