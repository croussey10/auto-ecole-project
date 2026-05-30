import { inject, Injectable } from '@angular/core'
import { Database } from '../../../types/database.types'
import { AuthService } from '../auth/auth-service'

@Injectable({
  providedIn: 'root',
})
export class AutoEcoleService {
  authService = inject(AuthService)

  async getAutoEcoleInfos(
    value: string,
    type: 'id' | 'slug',
  ): Promise<Database['public']['Tables']['auto_ecole']['Row'] | null> {
    const { data, error } = await this.authService.supabase
      .from('auto_ecole')
      .select('*')
      .eq(type, value)
      .maybeSingle()
    if (error) throw error
    return data
  }
}
