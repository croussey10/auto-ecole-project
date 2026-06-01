import {Component, inject} from '@angular/core'
import {ProfileService} from '../../../core/services/auth/profile-service'
import {MoniteurNextLessonsList} from '../moniteur-next-lessons-list/moniteur-next-lessons-list';
import {MoniteurPastLessonsList} from '../moniteur-past-lessons-list/moniteur-past-lessons-list';

@Component({
  selector: 'app-dashboard-moniteur',
  imports: [MoniteurNextLessonsList, MoniteurPastLessonsList],
  templateUrl: './moniteur-dashboard.html',
  styleUrl: './moniteur-dashboard.scss',
})
export class MoniteurDashboard {
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile
}
