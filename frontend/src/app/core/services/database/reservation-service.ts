import { inject, Injectable } from '@angular/core'
import { SupabaseService } from '../supabase/supabase-service'
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
  ): Promise<Database['public']['Views']['view_reservations']['Row'][]> {
    let query = this.authService.supabase
      .from('view_reservations')
      .select('*')
      .order('date_creneau', { ascending: true })
      .order('heure_debut', { ascending: true })

    if (role == 'eleve') {
      query = query.eq('eleve_id', profileId)
    } else {
      query = query.eq('moniteur_id', profileId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async cancelReservation(reservation_id: string) {
    const { data, error } = await this.authService.supabase
      .from('reservation')
      .update({ eleve_id: null })
      .eq('id', reservation_id)
    if (error) {
      throw error
    }
    return data
  }
}
