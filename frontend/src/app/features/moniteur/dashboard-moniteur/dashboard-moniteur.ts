import { Component, inject } from '@angular/core'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { NextLessonsList } from '../../../shared/components/next-lessons-list/next-lessons-list'
import { PastLessonsList } from '../../../shared/components/past-lessons-list/past-lessons-list'

@Component({
  selector: 'app-dashboard-moniteur',
  imports: [NextLessonsList, PastLessonsList],
  templateUrl: './dashboard-moniteur.html',
  styleUrl: './dashboard-moniteur.scss',
})
export class DashboardMoniteur {
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile
}
