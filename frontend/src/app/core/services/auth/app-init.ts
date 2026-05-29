import {inject} from '@angular/core';
import {AuthService} from './auth-service';
import {ProfileService} from './profile-service';

export function initializeApp() {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);

  return async () => {
    const {data: {session}} = await authService.supabase.auth.getSession();

    if (session?.user) {
      const autoEcoleId = localStorage.getItem('activeAutoEcoleId');
      if (autoEcoleId) {
        const profile = await profileService.getProfileInfos(session.user.id, 'user', autoEcoleId);
        profileService.currentProfile.set(profile);
      }
    }
  };
}
