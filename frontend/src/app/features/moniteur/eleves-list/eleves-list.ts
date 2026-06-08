import { Component, inject, resource, signal } from '@angular/core'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { EleveCard } from '../eleve-card/eleve-card'
import { Database } from '../../../types/database.types'
import { Dialog } from 'primeng/dialog'
import { LivretApprentissage } from '../../eleve/livret-apprentissage/livret-apprentissage'
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-eleves-list',
  imports: [EleveCard, Dialog, LivretApprentissage, ProgressSpinner],
  templateUrl: './eleves-list.html',
  styleUrl: './eleves-list.scss',
})
export class ElevesList {
  profileService = inject(ProfileService)
  profile = this.profileService.currentProfile

  visibleDialog = signal<boolean>(false)
  eleveToOpenLivret = signal<Database['public']['Tables']['profile']['Row'] | null>(null)

  resourceEleves = resource({
    params: () => this.profile(),
    loader: async ({ params }) => {
      if (!params) return
      const autoEcoleId = localStorage.getItem('activeAutoEcoleId')
      if (!autoEcoleId) return
      return await this.profileService.getEleves(autoEcoleId)
    },
  })
  eleves = this.resourceEleves.value

  openLivret(eleve: Database['public']['Tables']['profile']['Row']) {
    this.eleveToOpenLivret.set(eleve)
    this.visibleDialog.set(true)
  }
}
