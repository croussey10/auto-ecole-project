import { Component, inject, resource } from '@angular/core'
import { AchatHistoriqueService } from '../../../core/services/database/achat-historique-service'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { AchatHistoriqueCard } from '../achat-historique-card/achat-historique-card'
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-achats-historique-list',
  imports: [AchatHistoriqueCard, ProgressSpinner],
  templateUrl: './achats-historique-list.html',
  styleUrl: './achats-historique-list.scss',
})
export class AchatsHistoriqueList {
  achatHistoriqueService = inject(AchatHistoriqueService)
  profileService = inject(ProfileService)
  profile = this.profileService.currentProfile

  resourceAchats = resource({
    params: () => this.profile()?.id,
    loader: async ({ params }) => {
      if (!params) return
      return await this.achatHistoriqueService.getAchats(params)
    },
  })
  achats = this.resourceAchats.value
}
