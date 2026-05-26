import { Component, computed, inject, resource } from '@angular/core'
import { NextLessonCard } from '../next-lesson-card/next-lesson-card'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { ReservationService } from '../../../core/services/database/reservation-service'
import { Card } from 'primeng/card'
import { ScrollPanel } from 'primeng/scrollpanel'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { toSignal } from '@angular/core/rxjs-interop'

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
}
