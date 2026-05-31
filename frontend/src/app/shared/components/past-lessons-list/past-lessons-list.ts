import {Component, computed, inject, resource, signal} from '@angular/core'
import {LessonCard} from '../lesson-card/lesson-card'
import {ProfileService} from '../../../core/services/auth/profile-service'
import {ReservationService} from '../../../core/services/database/reservation-service'
import {Card} from 'primeng/card'
import {ScrollPanel} from 'primeng/scrollpanel'
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {toSignal} from '@angular/core/rxjs-interop'
import {AuthError} from '@supabase/supabase-js';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-past-lessons-list',
  imports: [LessonCard, Card, ScrollPanel],
  templateUrl: './past-lessons-list.html',
  styleUrl: './past-lessons-list.scss',
})
export class PastLessonsList {
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
      if (params.role == 'eleve') {
        return await this.reservationService.getReservations(params.id, 'eleve')
      } else {
        return await this.reservationService.getReservations(params.id, 'moniteur')
      }
    },
  })
  reservations = this.resourceReservations.value

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
    const numberReservations = this.reservationsPast().length
    if (!numberReservations) return '4rem'
    if (!this.isMobile()) {
      return `${Math.min(numberReservations * 7, 28)}rem `
    }
    return `${Math.min(numberReservations * 7, 21)}rem `
  })

  idBeingCancelled = signal<string | null>(null)

  async cancelReservation(reservationId: string | null) {
    if (!reservationId) return
    try {
      this.idBeingCancelled.set(reservationId)
      await this.reservationService.cancelReservation(reservationId)
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
