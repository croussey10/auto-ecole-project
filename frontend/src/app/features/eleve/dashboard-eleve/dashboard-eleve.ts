import { Component, inject } from '@angular/core'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { NextLessonsList } from '../../../shared/components/next-lessons-list/next-lessons-list'

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
