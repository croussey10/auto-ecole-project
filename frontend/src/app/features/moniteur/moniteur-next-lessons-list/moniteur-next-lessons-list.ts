import { Component, computed, inject, resource, signal } from '@angular/core'
import { NextLessonCard } from '../../../shared/components/next-lesson-card/next-lesson-card'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { ReservationService } from '../../../core/services/database/reservation-service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { toSignal } from '@angular/core/rxjs-interop'
import { AuthError } from '@supabase/supabase-js'
import { MessageService } from 'primeng/api'
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-moniteur-next-lessons-list',
  imports: [NextLessonCard, ProgressSpinner],
  templateUrl: './moniteur-next-lessons-list.html',
  styleUrl: './moniteur-next-lessons-list.scss',
})
export class MoniteurNextLessonsList {
  messageService = inject(MessageService)
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
      return await this.reservationService.getReservations(
        params.id,
        params.auto_ecole_id,
        'moniteur',
        true,
      )
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

  idBeingCancelled = signal<string | null>(null)

  async cancelReservation(reservationId: string | null) {
    if (!reservationId) return
    try {
      this.idBeingCancelled.set(reservationId)
      await this.reservationService.deleteReservation(reservationId)
      this.resourceReservations.reload()
    } catch (error) {
      const authError = error as AuthError
      this.messageService.add({
        severity: 'error',
        summary: `Erreur`,
        detail: authError.message,
      })
    } finally {
      this.idBeingCancelled.set(null)
      console.log(reservationId)
    }
  }
}
