import {Component, computed, inject, resource} from '@angular/core'
import {ProfileService} from '../../../core/services/auth/profile-service'
import {ReservationService} from '../../../core/services/database/reservation-service'
import {Card} from 'primeng/card'
import {ScrollPanel} from 'primeng/scrollpanel'
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {toSignal} from '@angular/core/rxjs-interop'
import {MoniteurPastLessonCard} from '../moniteur-past-lesson-card/moniteur-past-lesson-card';
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-moniteur-past-lessons-list',
  imports: [Card, MoniteurPastLessonCard, ProgressSpinner],
  templateUrl: './moniteur-past-lessons-list.html',
  styleUrl: './moniteur-past-lessons-list.scss',
})
export class MoniteurPastLessonsList {
  breakPointObserver = inject(BreakpointObserver)
  reservationService = inject(ReservationService)
  profileService = inject(ProfileService)

  breakpointMobile = toSignal(this.breakPointObserver.observe(Breakpoints.Handset))
  isMobile = computed(() => (this.breakpointMobile()?.matches ? true : false))

  profile = this.profileService.currentProfile

  resourceReservations = resource({
    params: () => this.profile(),
    loader: async ({ params }) => {
      if (!params) return null
      return await this.reservationService.getReservations(params.id, 'moniteur')
    },
  })
  reservations = this.resourceReservations.value

  filterReservations(type: 'past' | 'in_coming' | 'all') {
    const reservations = this.reservations()
    if (!reservations) return []

    const currentDate = Date.now()

    return reservations.filter((reservation) => {
      const reservationDate = new Date(
        `${reservation.date_creneau}T${reservation.heure_debut}`,
      ).getTime()

      if (type === 'in_coming') return reservationDate > currentDate
      if (type === 'past') return reservationDate <= currentDate
      return true
    })
  }

  reservationsInComing = computed(() => this.filterReservations('in_coming'))
  reservationsPast = computed(() => this.filterReservations('past'))
  allReservations = computed(() => this.filterReservations('all'))
}
