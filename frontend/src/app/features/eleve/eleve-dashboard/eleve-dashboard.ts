import { Component, inject } from '@angular/core'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { EleveNextLessonsList } from '../eleve-next-lessons-list/eleve-next-lessons-list'

@Component({
  selector: 'app-dashboard-eleve',
  imports: [EleveNextLessonsList],
  templateUrl: './eleve-dashboard.html',
  styleUrl: './eleve-dashboard.scss',
})
export class EleveDashboard {
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile
}
