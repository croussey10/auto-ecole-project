import { Component, inject } from '@angular/core'
import { EleveNextLessonsList } from '../eleve-next-lessons-list/eleve-next-lessons-list'
import { ProfileService } from '../../../core/services/auth/profile-service'

@Component({
  selector: 'app-dashboard-eleve',
  imports: [EleveNextLessonsList, EleveNextLessonsList],
  templateUrl: './dashboard-eleve.html',
  styleUrl: './dashboard-eleve.scss',
})
export class DashboardEleve {
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile

}
