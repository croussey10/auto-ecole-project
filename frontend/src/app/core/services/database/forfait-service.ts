import { inject, Injectable } from '@angular/core'
import { AuthService } from '../auth/auth-service'
import { Database } from '../../../types/database.types'

@Injectable({
  providedIn: 'root',
})
export class ForfaitService {
  authService = inject(AuthService)

  async getForfaits(
    autoEcoleId: string,
  ): Promise<Database['public']['Tables']['forfait']['Row'][]> {
    const { data, error } = await this.authService.supabase
      .from('forfait')
      .select('*')
      .eq('auto_ecole_id', autoEcoleId)
    if (error) throw error
    return data
  }

  async buyForfait(eleveId: string, forfaitId: string) {
    const { error } = await this.authService.supabase.rpc('valider_achat_forfait', {
      p_eleve_id: eleveId,
      p_forfait_id: forfaitId,
    })
    if (error) throw error
  }
}
