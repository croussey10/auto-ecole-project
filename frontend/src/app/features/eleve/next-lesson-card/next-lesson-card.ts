import { Component, computed, effect, inject, input, output, signal } from '@angular/core'
import { Card } from 'primeng/card'
import { Button } from 'primeng/button'
import { Database } from '../../../types/database.types'
import { ReservationService } from '../../../core/services/database/reservation-service'
import { AuthError } from '@supabase/supabase-js'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-next-lesson-card',
  imports: [Card, Button],
  templateUrl: './next-lesson-card.html',
  styleUrl: './next-lesson-card.scss',
})
export class NextLessonCard {
  messageService = inject(MessageService)
  reservationService = inject(ReservationService)

  cancelTrigger = output()
  reservation = input.required<Database['public']['Views']['view_eleve_reservations']['Row']>()

  canCancelReservation = computed(() => {
    const currentDate = Date.now()
    const reservationDate = new Date(
      `${this.reservation().date_creneau} ${this.reservation().heure_debut}`,
    ).getTime()

    return reservationDate - currentDate > 172800000
  })

  timerNextLesson = computed(() => {
    const currentDate = Date.now()
    const reservationDate = new Date(
      `${this.reservation().date_creneau} ${this.reservation().heure_debut}`,
    ).getTime()

    const diff = reservationDate - currentDate

    if (diff < 0) return

    const jours = Math.floor(diff / (1000 * 60 * 60 * 24))
    const resteMs = diff % (1000 * 60 * 60 * 24)
    const heures = Math.floor(resteMs / (1000 * 60 * 60))
    const minutes = Math.floor(resteMs / (1000 * 60)) % 60

    if (jours <= 0) return `Dans ${heures} heures et ${minutes} minutes`

    return `Dans ${jours} jours, ${heures} heures et ${minutes} minutes`
  })

  loadingCancel = signal<boolean>(false)

  async cancelReservation() {
    this.loadingCancel.set(true)
    const reservation_id = this.reservation().id
    if (!reservation_id) return
    try {
      await this.reservationService.cancelReservation(reservation_id)
      this.cancelTrigger.emit()
    } catch (error) {
      const authError = error as AuthError
      this.messageService.add({
        severity: 'error',
        summary: `Erreur`,
        detail: authError.message,
      })
    } finally {
      this.loadingCancel.set(false)
    }
  }
}
