import { Component, inject, resource } from '@angular/core'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { ForfaitService } from '../../../core/services/database/forfait-service'
import { ForfaitCard } from '../forfait-card/forfait-card'
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-forfaits-list',
  imports: [ForfaitCard, ProgressSpinner],
  templateUrl: './forfaits-list.html',
  styleUrl: './forfaits-list.scss',
})
export class ForfaitsList {
  forfaitService = inject(ForfaitService)
  profileService = inject(ProfileService)

  resourceForfaits = resource({
    params: () => this.profileService.activeAutoEcoleId(),
    loader: async ({ params }) => {
      if (!params) return
      return await this.forfaitService.getForfaits(params)
    },
  })
  forfaits = this.resourceForfaits.value
}
