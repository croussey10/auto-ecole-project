import {CanActivateFn, Router} from '@angular/router'
import {inject} from '@angular/core';
import {ProfileService} from '../services/auth/profile-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const profileService = inject(ProfileService)
  const router = inject(Router)
  const profile = profileService.currentProfile()

  const allowedRoles = route.data['roles'];

  if(!profile) {
    const slug = localStorage.getItem('activeAutoEcoleSlug')
    void router.navigate([`/auth/login/${slug}`])
    return false
  }

  if (allowedRoles?.includes(profile.role)) {
    return true;
  }

  return router.parseUrl(`/${profile.role}/dashboard`);
}
