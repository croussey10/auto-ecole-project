import { Component, inject, input, signal } from '@angular/core'
import { Database } from '../../../types/database.types'
import { Card } from 'primeng/card'
import { Button } from 'primeng/button'
import { ForfaitService } from '../../../core/services/database/forfait-service'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { FeedbackMessageService } from '../../../core/services/utility/feedback-message-service'

@Component({
  selector: 'app-forfait-card',
  imports: [Card, Button],
  templateUrl: './forfait-card.html',
  styleUrl: './forfait-card.scss',
})
export class ForfaitCard {
  feedbackMessageService = inject(FeedbackMessageService)
  profileService = inject(ProfileService)
  forfaitService = inject(ForfaitService)

  profile = this.profileService.currentProfile
  forfait = input.required<Database['public']['Tables']['forfait']['Row']>()
  loadingAchat = signal<boolean>(false)

  async buyForfait() {
    const profileId = this.profile()?.id
    if (!profileId) return
    this.loadingAchat.set(true)
    try {
      await this.forfaitService.buyForfait(profileId, this.forfait().id)
      this.feedbackMessageService.successFeedbackMessage(
        'Succes',
        `Vous avez acheté le forfait ${this.forfait().nom}`,
      )
    } catch (error: any) {
      const errorCode = error?.code || 'Erreur inconnue'
      const errorDetail =
        error?.message || "Une erreur inattendue s'est produite lors de l'achat"
      this.feedbackMessageService.errorFeedbackMessage(errorCode, errorDetail)
    } finally {
      this.loadingAchat.set(false)
    }
  }
}
