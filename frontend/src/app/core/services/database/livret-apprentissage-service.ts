import { inject, Injectable } from '@angular/core'
import { AuthService } from '../auth/auth-service'
import { Database } from '../../../types/database.types'

@Injectable({
  providedIn: 'root',
})
export class LivretApprentissageService {
  authService = inject(AuthService)

  async getCompetencesOfLivret(eleve_id: string): Promise<Database["public"]["Views"]["view_livret_competence"]["Row"][]> {
    const { data, error } = await this.authService.supabase
      .from('view_livret_competence')
      .select('*')
      .eq('eleve_id', eleve_id)
    if (error) throw error
    return data
  }
}
