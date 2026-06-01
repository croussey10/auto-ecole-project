import { Component, inject } from '@angular/core'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { EleveNextLessonsList } from '../eleve-next-lessons-list/eleve-next-lessons-list'
import {ElevePastLessonsList} from '../eleve-past-lessons-list/eleve-past-lessons-list';

@Component({
  selector: 'app-dashboard-eleve',
  imports: [EleveNextLessonsList, ElevePastLessonsList],
  templateUrl: './eleve-dashboard.html',
  styleUrl: './eleve-dashboard.scss',
})
export class EleveDashboard {
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile
}
