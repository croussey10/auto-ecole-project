import { Component, computed, inject, resource, signal } from '@angular/core'
import { CalendarGrid } from '../../../shared/components/calendar-grid/calendar-grid'
import { Dialog } from 'primeng/dialog'
import { DatePipe } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Button } from 'primeng/button'
import { Checkbox } from 'primeng/checkbox'
import { Select } from 'primeng/select'
import { ReservationService } from '../../../core/services/database/reservation-service'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { differenceInHours, format } from 'date-fns'
import { FeedbackMessageService } from '../../../core/services/utility/feedback-message-service'
import { Database } from '../../../types/database.types'
import { InputText } from 'primeng/inputtext'
import { Tag } from 'primeng/tag'

@Component({
  selector: 'app-moniteur-calendar',
  imports: [
    CalendarGrid,
    Dialog,
    DatePipe,
    ReactiveFormsModule,
    Button,
    Checkbox,
    Select,
    InputText,
    Tag,
  ],
  templateUrl: './moniteur-calendar.html',
  styleUrl: './moniteur-calendar.scss',
})
export class MoniteurCalendar {
  feedbackMessageService = inject(FeedbackMessageService)
  reservationService = inject(ReservationService)
  profileService = inject(ProfileService)

  modaleCreateReservationVisible = signal<boolean>(false)
  loadingSubmit = signal<boolean>(false)
  selectedDate = signal<Date>(new Date())

  reservations = computed(() => this.resourceReservations.value() || [])

  modaleDetailsReservationVisible = signal<boolean>(false)
  selectedReservation = signal<Database['public']['Views']['view_reservation']['Row'] | null>(null)
  loadingCancel = signal<boolean>(false)

  availableHours = [
    { label: '08:00', value: '08:00' },
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
    { label: '17:00', value: '17:00' },
    { label: '18:00', value: '18:00' },
    { label: '19:00', value: '19:00' },
    { label: '20:00', value: '20:00' },
  ]

  form = new FormGroup({
    vehicule: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    hour: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    isManual: new FormControl(false, {
      nonNullable: true,
    }),
  })

  resourceReservations = resource({
    params: () => this.profileService.currentProfile(),
    loader: async ({ params }) => {
      if (!params) return []
      return await this.reservationService.getReservations(
        params.id,
        params.auto_ecole_id,
        'moniteur',
        true,
      )
    },
  })

  onClickedDay(date: Date) {
    this.selectedDate.set(date)
    this.modaleCreateReservationVisible.set(true)
  }

  closeModal() {
    this.modaleCreateReservationVisible.set(false)
  }

  async submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const profile = this.profileService.currentProfile()
    if (!profile) return

    const reservation = this.form.getRawValue()
    if (!reservation) return

    this.loadingSubmit.set(true)
    const formattedDate = format(this.selectedDate(), 'yyyy-MM-dd')

    try {
      await this.reservationService.createReservation(
        profile.auto_ecole_id,
        profile.id,
        formattedDate,
        reservation.hour,
        reservation.vehicule,
        reservation.isManual,
      )
      this.feedbackMessageService.successFeedbackMessage('Succes', 'Heure ajoutée avec succes !')
      this.closeModal()
      this.resourceReservations.reload()
    } catch (error: any) {
      const errorCode = error?.code || 'Erreur inconnue'
      if (errorCode == 23505) {
        this.feedbackMessageService.errorFeedbackMessage(
          errorCode,
          'Vous avez déjà réservez une heure à ce crénaux !',
        )
      } else {
        const errorDetail =
          error?.message || "Une erreur inattendue s'est produite lors de la modification."
        this.feedbackMessageService.errorFeedbackMessage(errorCode, errorDetail)
      }
    } finally {
      this.loadingSubmit.set(false)
    }
  }

  onReservationClicked(reservation: Database['public']['Views']['view_reservation']['Row']) {
    this.selectedReservation.set(reservation)
    this.modaleDetailsReservationVisible.set(true)
  }

  closeReservationDetailsModal() {
    this.modaleDetailsReservationVisible.set(false)
    this.selectedReservation.set(null)
  }

  isPastReservation(): boolean {
    const reservation = this.selectedReservation()
    if (!reservation) return false
    const reservationDate = new Date(
      `${reservation.date_creneau}T${reservation.heure_debut}`,
    ).getTime()
    return reservationDate <= Date.now()
  }

  async cancelReservation() {
    const reservation = this.selectedReservation()
    if (!reservation?.id) return

    this.loadingCancel.set(true)
    try {
      await this.reservationService.deleteReservation(reservation.id)
      this.feedbackMessageService.successFeedbackMessage('Succès', 'Le créneau a été annulé.')
      this.closeReservationDetailsModal()
      this.resourceReservations.reload()
    } catch (error: any) {
      this.feedbackMessageService.errorFeedbackMessage('Erreur', "Impossible d'annuler ce créneau.")
    } finally {
      this.loadingCancel.set(false)
    }
  }

  canCancel(): boolean {
    const reservation = this.selectedReservation()
    if (!reservation) return false
    const reservationDate = new Date(
      `${reservation.date_creneau}T${reservation.heure_debut}`,
    ).getTime()
    return differenceInHours(reservationDate, new Date()) >= 48
  }
}
