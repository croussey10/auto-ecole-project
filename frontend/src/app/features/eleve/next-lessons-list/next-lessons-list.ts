import {Component, computed, inject, resource, signal} from '@angular/core'
import {NextLessonCard} from '../next-lesson-card/next-lesson-card'
import {ProfileService} from '../../../core/services/auth/profile-service'
import {ReservationService} from '../../../core/services/database/reservation-service'
import {Card} from 'primeng/card'
import {ScrollPanel} from 'primeng/scrollpanel'
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {toSignal} from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-next-lessons-list',
  imports: [NextLessonCard, Card, ScrollPanel],
  templateUrl: './next-lessons-list.html',
  styleUrl: './next-lessons-list.scss',
})
export class NextLessonsList {
  breakPointObserver = inject(BreakpointObserver)
  reservationService = inject(ReservationService)
  profileService = inject(ProfileService)

  breakpointMobile = toSignal(this.breakPointObserver.observe(Breakpoints.Handset))
  isMobile = computed(() => (this.breakpointMobile()?.matches ? true : false))

  profile = this.profileService.currentProfile

  resourceReservation = resource({
    params: () => this.profile(),
    loader: async ({ params }) => {
      if (!params) return null
      return await this.reservationService.getEleveReservations(params.id)
    },
  })
  reservations = this.resourceReservation.value

  filterReservations(type: 'past' | 'in_coming' | 'all') {
    const reservations = this.reservations()
    if (!reservations) return []

    const currentDate = Date.now()

    return reservations.filter((reservation) => {
      const reservationDate = new Date(
        `${reservation.date_creneau} ${reservation.heure_debut}`,
      ).getTime()

      if (type === 'in_coming') return reservationDate > currentDate
      if (type === 'past') return reservationDate <= currentDate
      return true
    })
  }

  reservationsInComing = computed(() => this.filterReservations('in_coming'))
  reservationsPast = computed(() => this.filterReservations('past'))
  allReservations = computed(() => this.filterReservations('all'))

  heightScrollPanel = computed(() => {
    const numberReservations = this.reservationsInComing().length
    if (!numberReservations) return '4rem'
    if (!this.isMobile()) {
      return `${Math.min(numberReservations * 7, 28)}rem `
    }
    return `${Math.min(numberReservations * 7, 21)}rem `
  })
}
