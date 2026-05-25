import {inject, Injectable, resource, signal} from '@angular/core';
import {AuthService} from './auth-service';
import {Database} from '../../../types/database.types';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  router = inject(Router)
  authService = inject(AuthService);
  activeAutoEcoleId = signal<string | null>(null);
  activeAutoEcoleSlug = signal<string | null>(null);

  constructor() {
    this.activeAutoEcoleId.set(localStorage.getItem('activeAutoEcoleId'))
    this.activeAutoEcoleSlug.set(localStorage.getItem('activeAutoEcoleSlug'))
  }

  resourceProfile = resource({
    params: () => ({
      user: this.authService.currentUser(),
      schoolId: this.activeAutoEcoleId()
    }),
    loader: async ({params}) => {
      if (!params.user || !params.schoolId) return null
      try {
        return await this.getProfileInfos(params.user.id, params.schoolId);
      } catch {
        this.authService.currentUser.set(null);
        this.activeAutoEcoleId.set(null)
        const slugAutoEcole = this.activeAutoEcoleSlug()
        this.activeAutoEcoleSlug.set(null)
        localStorage.removeItem('activeAutoEcoleId');
        localStorage.removeItem('activeAutoEcoleSlug');
        await this.authService.supabase.auth.signOut({scope: 'local'})
        void this.router.navigate([`/auth/login/${slugAutoEcole}`])
        return null
      }
    }
  });

  currentProfile = this.resourceProfile.value

  async registerProfile(userId: string, slugId: string, firstName: string, lastName: string): Promise<Database['public']['Tables']['profile']['Row']> {
    const {data, error} = await this.authService.supabase
      .from('profile')
      .insert({
        user_id: userId,
        auto_ecole_id: slugId,
        prenom: firstName,
        nom: lastName,
        role: 'eleve'
      })
      .select('*')
      .single()
    if (error) throw error;
    return data
  }

  async getProfileInfos(userId: string, autoEcoleId: string): Promise<Database['public']['Tables']['profile']['Row']> {
    const {data, error} = await this.authService.supabase
      .from('profile')
      .select('*')
      .eq('user_id', userId)
      .eq('auto_ecole_id', autoEcoleId)
      .single();
    if (error) throw error;
    return data
  }

  async getProfileInfosByProfile(profileId: string, autoEcoleId: string): Promise<Database['public']['Tables']['profile']['Row']> {
    const {data, error} = await this.authService.supabase
      .from('profile')
      .select('*')
      .eq('id', profileId)
      .eq('auto_ecole_id', autoEcoleId)
      .single();
    if (error) throw error;
    return data
  }
}
