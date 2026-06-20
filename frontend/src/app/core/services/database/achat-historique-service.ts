import { inject, Injectable } from '@angular/core'
import { AuthService } from '../auth/auth-service'
import { Database } from '../../../types/database.types'

@Injectable({
  providedIn: 'root',
})
export class AchatHistoriqueService {
  authService = inject(AuthService)

  async getAchats(
    eleveId: string,
  ): Promise<Database['public']['Tables']['achat_historique']['Row'][]> {
    const { data, error } = await this.authService.supabase
      .from('achat_historique')
      .select('*')
      .eq('eleve_id', eleveId)
    if (error) throw error
    return data
  }
}
