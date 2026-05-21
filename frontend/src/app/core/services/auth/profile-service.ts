import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { Database } from '../../../types/database.types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  authService = inject(AuthService);

  currentProfile = signal<Database['public']['Tables']['profile']['Row'] | null>(null);

  async login(email: string, password: string) {
    const authData = await this.authService.login(email, password);
    if (authData.user) {
      await this.getUserInfos(authData.user.id)
    }
  }

  async getUserInfos(userId: string) {
    const { data, error } = await this.authService.supabase
      .from('profile')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    this.currentProfile.set(data);
    console.log(this.currentProfile())
  }
}
