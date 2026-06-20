import { Component, computed, inject, resource, signal } from '@angular/core'
import { ReservationService } from '../../../core/services/database/reservation-service'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { Select } from 'primeng/select'
import { MultiSelect } from 'primeng/multiselect'
import { FormsModule } from '@angular/forms'
import { CalendarGrid } from '../../../shared/components/calendar-grid/calendar-grid'
import { Dialog } from 'primeng/dialog'
import { differenceInHours } from 'date-fns'
import { Button } from 'primeng/button'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-eleve-calendar',
  imports: [Select, MultiSelect, FormsModule, CalendarGrid, Dialog, Button, DatePipe],
  templateUrl: './eleve-calendar.html',
  styleUrl: './eleve-calendar.scss',
})
export class EleveCalendar {
  reservationService = inject(ReservationService)
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile

  calendarResource = resource({
    params: () => this.profile(),
    loader: async ({ params }) => {
      if (!params) return
      return await this.reservationService.getStudentCalendarData(params.id, params.auto_ecole_id)
    },
  })
  calendar = this.calendarResource.value

  isModalVisible = signal<boolean>(false)
  selectedBooking = signal<any | null>(null)

  selectedTransmission = signal<'all' | 'manual' | 'automatic'>('all')
  selectedInstructors = signal<string[]>([])

  transmissionOptions = [
    { label: 'Toutes les boîtes', value: 'all' },
    { label: 'Boîte Manuelle', value: 'manual' },
    { label: 'Boîte Automatique', value: 'automatic' },
  ]

  instructorOptions = computed(() => {
    const reservations = this.calendar() || []
    const map = new Map<string, string>()

    reservations.forEach((reservation) => {
      if (reservation.moniteur_id && reservation.moniteur_nom) {
        map.set(
          reservation.moniteur_id,
          `${reservation.moniteur_prenom} ${reservation.moniteur_nom}`,
        )
      }
    })

    return Array.from(map.entries()).map(([id, label]) => ({ label, value: id }))
  })

  filteredReservations = computed(() => {
    const reservations = this.calendar() || []
    const transmission = this.selectedTransmission()
    const instructors = this.selectedInstructors()

    return reservations.filter((booking) => {
      const matchesTransmission =
        transmission === 'all' ||
        (transmission === 'manual' && booking.is_manuelle) ||
        (transmission === 'automatic' && !booking.is_manuelle)

      const matchesInstructor =
        instructors.length === 0 ||
        (booking.moniteur_id && instructors.includes(booking.moniteur_id))

      return matchesTransmission && matchesInstructor
    })
  })

  handleBookingClick(reservation: any) {
    this.selectedBooking.set(reservation)
    this.isModalVisible.set(true)
  }

  isMyBooking() {
    return this.selectedBooking()?.eleve_id === this.profile()?.id
  }

  canCancel() {
    const booking = this.selectedBooking()
    if (!booking) return false

    const reservationDate = new Date(`${booking.date_creneau}T${booking.heure_debut}`)
    const hoursDifference = differenceInHours(reservationDate, new Date())

    return hoursDifference >= 48
  }

  async reserverHeure() {
    const reservation = this.selectedBooking()
    const eleveId = this.profile()?.id
    if (!reservation || !eleveId) return

    try {
      await this.reservationService.claimReservation(reservation.id, eleveId)
      this.isModalVisible.set(false)
      this.calendarResource.reload()
    } catch (error) {
      console.error('Erreur réservation', error)
    }
  }

  async cancelHour() {
    const reservation = this.selectedBooking()
    if (!reservation) return

    try {
      await this.reservationService.cancelReservation(reservation.id)
      this.isModalVisible.set(false)
      this.calendarResource.reload()
    } catch (error) {
      console.error('Erreur annulation', error)
    }
  }
}
