import { Component, computed, input, output } from '@angular/core'
import { Card } from 'primeng/card'
import { Button } from 'primeng/button'
import { Database } from '../../../types/database.types'

@Component({
  selector: 'app-next-lesson-card',
  imports: [Card, Button],
  templateUrl: './next-lesson-card.html',
  styleUrl: './next-lesson-card.scss',
})
export class NextLessonCard {

  cancelTrigger = output()
  reservation = input.required<Database['public']['Views']['view_reservations']['Row']>()
  loadingCancel = input.required<boolean>()
  personRole = input.required<string>()
  personName = input.required<string>()

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

    if (heures <= 0) return `Dans ${minutes} minutes`
    if (jours <= 0) return `Dans ${heures} heures et ${minutes} minutes`
    return `Dans ${jours} jours, ${heures} heures et ${minutes} minutes`
  })

  cancelReservation() {
    this.cancelTrigger.emit()
  }
}
