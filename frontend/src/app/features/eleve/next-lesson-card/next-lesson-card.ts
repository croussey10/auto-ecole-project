import {Component, computed, effect, inject, input, resource, signal} from '@angular/core';
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

  reservation = input.required<Database["public"]["Tables"]["reservation"]["Row"]>()

  ressourceMoniteur = resource({
    params: () => this.reservation(),
    loader: async ({params}) => {
      if (!params) return null
      return await this.profileService.getProfileInfosByProfile(params.moniteur_id, params.auto_ecole_id)
    }
  })
  moniteur = this.ressourceMoniteur.value
}
