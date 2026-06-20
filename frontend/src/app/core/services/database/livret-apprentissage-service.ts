import { inject, Injectable } from '@angular/core'
import { AuthService } from '../auth/auth-service'
import { Database } from '../../../types/database.types'

@Injectable({
  providedIn: 'root',
})
export class LivretApprentissageService {
  authService = inject(AuthService)

  async getCompetencesOfLivret(
    eleveId: string,
  ): Promise<Database['public']['Views']['view_livret_competence']['Row'][]> {
    const { data, error } = await this.authService.supabase
      .from('view_livret_competence')
      .select('*')
      .eq('eleve_id', eleveId)
    if (error) throw error
    return data
  }

  async updateCompetence(eleveId: string, competenceId: string, newMaitrise: string) {
    const { error } = await this.authService.supabase
      .from('livret_apprentissage')
      .update({ maitrise: newMaitrise })
      .eq('eleve_id', eleveId)
      .eq('competence_id', competenceId)
    if (error) throw error
  }
}
