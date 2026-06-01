import {Component, inject, signal} from '@angular/core'
import {Carousel} from 'primeng/carousel';
import {Button} from 'primeng/button';
import {ElevePastLessonsList} from '../../../features/eleve/eleve-past-lessons-list/eleve-past-lessons-list';
import {EleveNextLessonsList} from '../../../features/eleve/eleve-next-lessons-list/eleve-next-lessons-list';
import {ProfileService} from '../../../core/services/auth/profile-service';
import {
  MoniteurPastLessonsList
} from '../../../features/moniteur/moniteur-past-lessons-list/moniteur-past-lessons-list';
import {
  MoniteurNextLessonsList
} from '../../../features/moniteur/moniteur-next-lessons-list/moniteur-next-lessons-list';

@Component({
  selector: 'app-mes-reservasions',
  imports: [
    Carousel,
    Button,
    ElevePastLessonsList,
    EleveNextLessonsList,
    MoniteurPastLessonsList,
    MoniteurNextLessonsList
  ],
  templateUrl: './mes-reservasions.html',
  styleUrl: './mes-reservasions.scss',
})
export class MesReservasions {

  profileService = inject(ProfileService)
  profile = this.profileService.currentProfile

  pages = signal<number[]>([1,2]);

}
