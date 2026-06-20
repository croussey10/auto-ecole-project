import { Component, computed, inject, resource } from '@angular/core'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { ReservationService } from '../../../core/services/database/reservation-service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { toSignal } from '@angular/core/rxjs-interop'
import { ElevePastLessonCard } from '../eleve-past-lesson-card/eleve-past-lesson-card'
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-eleve-past-lessons-list',
  imports: [ElevePastLessonCard, ProgressSpinner],
  templateUrl: './eleve-past-lessons-list.html',
  styleUrl: './eleve-past-lessons-list.scss',
})
export class ElevePastLessonsList {
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
      return await this.reservationService.getReservations(params.id, params.auto_ecole_id, 'eleve')
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
