import { inject, Injectable } from '@angular/core'
import { Database } from '../../../types/database.types'
import { AuthService } from '../auth/auth-service'

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  authService = inject(AuthService)

  async getReservations(
    profileId: string,
    role: 'eleve' | 'moniteur',
  ): Promise<Database['public']['Views']['view_reservation']['Row'][]> {
    const { data, error } = await this.authService.supabase
      .from('view_reservation')
      .select('*')
      .order('date_creneau', { ascending: true })
      .order('heure_debut', { ascending: true })
      .eq(role == 'eleve' ? 'eleve_id' : 'moniteur_id', profileId)
    if (error) throw error
    return data
  }

  async cancelReservation(reservation_id: string) {
    const { data, error } = await this.authService.supabase
      .from('reservation')
      .update({ eleve_id: null })
      .eq('id', reservation_id)
    if (error) throw error
    return data
  }

  async updateCommentaireMoniteur(reservation_id: string, commentaire: string) {
    const { error } = await this.authService.supabase
      .from('reservation')
      .update({ commentaire_moniteur: commentaire })
      .eq('id', reservation_id)
    if (error) throw error
  }
}
