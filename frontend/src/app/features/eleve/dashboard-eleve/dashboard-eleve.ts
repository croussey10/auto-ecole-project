import { Component, inject } from '@angular/core'
import { NextLessonsList } from '../next-lessons-list/next-lessons-list'
import { ProfileService } from '../../../core/services/auth/profile-service'

@Component({
  selector: 'app-dashboard-eleve',
  imports: [NextLessonsList],
  templateUrl: './dashboard-eleve.html',
  styleUrl: './dashboard-eleve.scss',
})
export class DashboardEleve {
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile

}
