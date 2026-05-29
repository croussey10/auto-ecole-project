import { Component, inject } from '@angular/core'
import { MoniteurNextLessonsList } from '../moniteur-next-lessons-list/moniteur-next-lessons-list'
import { ProfileService } from '../../../core/services/auth/profile-service'

@Component({
  selector: 'app-dashboard-moniteur',
  imports: [MoniteurNextLessonsList],
  templateUrl: './dashboard-moniteur.html',
  styleUrl: './dashboard-moniteur.scss',
})
export class DashboardMoniteur {
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile

}
