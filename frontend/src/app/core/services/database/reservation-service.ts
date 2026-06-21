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
    autoEcoleId: string,
    role: 'eleve' | 'moniteur',
    ascending: boolean,
  ): Promise<Database['public']['Views']['view_reservation']['Row'][]> {
    const { data, error } = await this.authService.supabase
      .from('view_reservation')
      .select('*')
      .eq(role == 'eleve' ? 'eleve_id' : 'moniteur_id', profileId)
      .eq('auto_ecole_id', autoEcoleId)
      .order('date_creneau', { ascending: ascending })
      .order('heure_debut', { ascending: true })
    if (error) throw error
    return data
  }

  async getAvailableReservations(): Promise<
    Database['public']['Views']['view_reservation']['Row'][]
  > {
    const { data, error } = await this.authService.supabase
      .from('view_reservation')
      .select('*')
      .order('date_creneau', { ascending: true })
      .order('heure_debut', { ascending: true })
      .is('eleve_id', null)
    if (error) throw error
    return data
  }

  async getStudentCalendarData(
    studentId: string,
    autoEcoleId: string,
  ): Promise<Database['public']['Views']['view_reservation']['Row'][]> {
    const [myReservations, availableBookings] = await Promise.all([
      this.getReservations(studentId, autoEcoleId, 'eleve', true),
      this.getAvailableReservations(),
    ])
    return [...myReservations, ...availableBookings]
  }

  async cancelReservation(reservation_id: string) {
    const { data, error } = await this.authService.supabase
      .from('reservation')
      .update({ eleve_id: null })
      .eq('id', reservation_id)
    if (error) throw error
    return data
  }

  async deleteReservation(reservation_id: string) {
    const { error } = await this.authService.supabase
      .from('reservation')
      .delete()
      .eq('id', reservation_id)
    if (error) throw error
  }

  async updateCommentaireMoniteur(reservation_id: string, commentaire: string) {
    const { error } = await this.authService.supabase
      .from('reservation')
      .update({ commentaire_moniteur: commentaire })
      .eq('id', reservation_id)
    if (error) throw error
  }

  async createReservation(
    auto_ecole_id: string,
    moniteur_id: string,
    date_creneau: string,
    heure_debut: string,
    vehicule: string,
    is_manuelle: boolean,
  ) {
    const { data, error } = await this.authService.supabase
      .from('reservation')
      .insert([
        {
          auto_ecole_id: auto_ecole_id,
          moniteur_id: moniteur_id,
          date_creneau: date_creneau,
          heure_debut: heure_debut,
          vehicule: vehicule,
          is_manuelle: is_manuelle,
        },
      ])
      .select()
    if (error) throw error
    return data
  }

  async claimReservation(reservationId: string, eleveId: string) {
    const { error } = await this.authService.supabase
      .from('reservation')
      .update({ eleve_id: eleveId })
      .eq('id', reservationId)
    if (error) throw error
  }
}
