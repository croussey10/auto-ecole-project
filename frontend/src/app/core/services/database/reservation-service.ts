import { inject, Injectable } from '@angular/core'
import { SupabaseService } from '../supabase/supabase-service'
import { Database } from '../../../types/database.types'

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  supabase = inject(SupabaseService)

  async getEleveReservations(
    profileId: string,
  ): Promise<Database['public']['Views']['view_eleve_reservations']['Row'][]> {
    const { data, error } = await this.supabase.supabase
      .from('view_eleve_reservations')
      .select('*')
      .order('date_creneau', { ascending: true })
      .order('heure_debut', { ascending: true })
      .eq('eleve_id', profileId)
    if (error) throw error
    return data
  }

  async cancelReservation(reservation_id: string) {
    const { data, error } = await this.supabase.supabase
      .from('reservation')
      .update({ eleve_id: null })
      .eq('id', reservation_id)
    if (error) {
      throw error
    }
    return data
  }
}
