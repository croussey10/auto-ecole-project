import { inject, Injectable, signal } from '@angular/core'
import { AuthService } from './auth-service'
import { Database } from '../../../types/database.types'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  router = inject(Router)
  authService = inject(AuthService)
  activeAutoEcoleId = signal<string | null>(null)
  activeAutoEcoleSlug = signal<string | null>(null)

  constructor() {
    this.activeAutoEcoleId.set(localStorage.getItem('activeAutoEcoleId'))
    this.activeAutoEcoleSlug.set(localStorage.getItem('activeAutoEcoleSlug'))
    this.authService.supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') this.currentProfile.set(null)
    })
  }

  currentProfile = signal<Database['public']['Tables']['profile']['Row'] | null>(null)

  async registerProfile(
    userId: string,
    slugId: string,
    firstName: string,
    lastName: string,
  ): Promise<Database['public']['Tables']['profile']['Row']> {
    const { data, error } = await this.authService.supabase
      .from('profile')
      .insert({
        user_id: userId,
        auto_ecole_id: slugId,
        prenom: firstName,
        nom: lastName,
        role: 'eleve',
      })
      .select('*')
      .single()
    if (error) throw error
    return data
  }

  async getProfileInfos(
    id: string,
    type: 'user' | 'profile',
    autoEcoleId: string,
  ): Promise<Database['public']['Tables']['profile']['Row']> {
    const { data, error } = await this.authService.supabase
      .from('profile')
      .select('*')
      .eq('auto_ecole_id', autoEcoleId)
      .eq(type == 'user' ? 'user_id' : 'id', id)
      .single()
    if (error) throw error
    return data
  }

  async getEleves(autoEcoleId: string): Promise<Database['public']['Tables']['profile']['Row'][]> {
    const { data, error } = await this.authService.supabase
      .from('profile')
      .select('*')
      .eq('role', 'eleve')
      .eq('auto_ecole_id', autoEcoleId)
    if (error) throw error
    return data
  }
}
