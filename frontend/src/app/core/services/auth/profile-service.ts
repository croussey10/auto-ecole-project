import {computed, effect, inject, Injectable, resource, signal} from '@angular/core';
import {AuthService} from './auth-service';
import {Database} from '../../../types/database.types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  authService = inject(AuthService);
  activeAutoEcoleId = signal<string | null>(null);

  constructor() {
    this.activeAutoEcoleId.set(localStorage.getItem('activeAutoEcoleId'))
  }

  resourceProfile = resource({
    params: () => ({
      user: this.authService.currentUser(),
      schoolId: this.activeAutoEcoleId()
    }),
    loader: async ({params}) => {
      if (!params.user || !params.schoolId) return null;
      return this.getProfileInfos(params.user.id, params.schoolId);
    }
  });

  currentProfile =  this.resourceProfile.value

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
}
