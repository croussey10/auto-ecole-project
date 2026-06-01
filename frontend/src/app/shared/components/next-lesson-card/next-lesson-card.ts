import {Component, computed, input, output} from '@angular/core'
import {Card} from 'primeng/card'
import {Button} from 'primeng/button';
import {Database} from '../../../types/database.types';

@Component({
  selector: 'app-next-lesson-card',
  imports: [Card, Button],
  templateUrl: './next-lesson-card.html',
  styleUrl: './next-lesson-card.scss',
})
export class NextLessonCard {

  cancelTrigger = output()
  loadingCancel = input.required<boolean>();
  reservation = input.required<Database["public"]["Views"]["view_reservations"]["Row"]>()
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

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const resteMs = diff % (1000 * 60 * 60 * 24)
    const hours = Math.floor(resteMs / (1000 * 60 * 60))
    const minutes = Math.floor(resteMs / (1000 * 60)) % 60

    if (hours <= 0) return `Dans ${minutes} minutes`
    if (days <= 0) return `Dans ${hours} heures et ${minutes} minutes`
    return `Dans ${days} jours, ${hours} heures et ${minutes} minutes`
  })

}
