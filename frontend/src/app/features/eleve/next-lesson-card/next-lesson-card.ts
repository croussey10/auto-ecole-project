import {Component, computed, effect, inject, signal} from '@angular/core';
import {Card} from 'primeng/card';
import {ReservationService} from '../../../core/services/database/reservation-service';
import {ProfileService} from '../../../core/services/auth/profile-service';
import {Button} from 'primeng/button';
import {Database} from '../../../types/database.types';

@Component({
  selector: 'app-next-lesson-card',
  imports: [
    Card,
    Button
  ],
  templateUrl: './next-lesson-card.html',
  styleUrl: './next-lesson-card.scss',
})
export class NextLessonCard {
  reservationService = inject(ReservationService)
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile
  reservations = signal<Database["public"]["Tables"]["reservation"]["Row"][] | []>([])

  oneReservation = computed(() => {
    const reservations = this.reservations()

    if (!reservations) return
    return reservations[0]
  })

  moniteur = computed(() => {
    const profile = this.profile()
    const reservation = this.oneReservation()

    if (!profile || !reservation) return
    return this.profileService.getProfileInfos(reservation.moniteur_id, profile.auto_ecole_id)
  })

  constructor() {
    effect(async () => {
      const profile = this.profile()
      if (!profile) return
      const reservations = await this.reservationService.getEleveReservations(profile.id)
      this.reservations.set(reservations)
      console.log(this.reservations())
      console.log(this.oneReservation())
    });
  }

}
