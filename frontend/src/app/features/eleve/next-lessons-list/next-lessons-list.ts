import { Component, computed, inject, resource } from '@angular/core';
import {NextLessonCard} from '../next-lesson-card/next-lesson-card';
import {ProfileService} from '../../../core/services/auth/profile-service';
import {ReservationService} from '../../../core/services/database/reservation-service';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-next-lessons-list',
  imports: [NextLessonCard, Card],
  templateUrl: './next-lessons-list.html',
  styleUrl: './next-lessons-list.scss',
})
export class NextLessonsList {
  reservationService = inject(ReservationService);
  profileService = inject(ProfileService);

  profile = this.profileService.currentProfile;

  ressourceReservation = resource({
    params: () => this.profile(),
    loader: async ({ params }) => {
      if (!params) return null;
      return await this.reservationService.getEleveReservations(params.id);
    },
  });
  reservations = this.ressourceReservation.value;
}
