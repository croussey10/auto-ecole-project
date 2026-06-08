import { Component, computed, inject, input, resource, signal } from '@angular/core'
import { LivretApprentissageService } from '../../../core/services/database/livret-apprentissage-service'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { CompetenceCard } from '../competence-card/competence-card'
import { FormsModule } from '@angular/forms'
import { SelectButton } from 'primeng/selectbutton'
import { InputText } from 'primeng/inputtext'
import { ProgressSpinner } from 'primeng/progressspinner'
import { FeedbackMessageService } from '../../../core/services/utility/feedback-message-service'

@Component({
  selector: 'app-livret-apprentissage',
  imports: [CompetenceCard, FormsModule, SelectButton, InputText, ProgressSpinner],
  templateUrl: './livret-apprentissage.html',
  styleUrl: './livret-apprentissage.scss',
})
export class LivretApprentissage {
  feedbackMessage = inject(FeedbackMessageService)
  livretApprentissageService = inject(LivretApprentissageService)
  profileService = inject(ProfileService)

  canEditMaitrise = input<boolean>(false)
  eleveTargetId = input<string | undefined>()

  profile = this.profileService.currentProfile

  resourceCompetences = resource({
    params: () => this.eleveTargetId() ?? this.profile()?.id,
    loader: async ({ params }) => {
      if (!params) return
      return await this.livretApprentissageService.getCompetencesOfLivret(params)
    },
  })
  competences = this.resourceCompetences.value

  selectedMaitrises = signal<string[]>([])
  selectedCategories = signal<string[]>([])
  search = signal<string>('')

  maitrises = [
    { label: 'Neutre', value: 'Neutre' },
    { label: 'A revoir', value: 'A revoir' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Acquis', value: 'Acquis' },
  ]
  categories = [
    { label: 'Maîtriser', value: 'Maîtriser' },
    { label: 'Appréhender', value: 'Appréhender' },
    { label: 'Pratiquer', value: 'Pratiquer' },
    { label: 'Circuler', value: 'Circuler' },
  ]

  filter = computed(() => {
    const listeCompetences = this.competences() || []
    const selectionMaitrise = this.selectedMaitrises()
    const selectionCategory = this.selectedCategories()
    const search = this.search()

    return listeCompetences.filter((competence) => {
      const maitrisesFiltered =
        selectionMaitrise.length === 0 || selectionMaitrise.includes(competence.maitrise!)
      const categoriesFiltered =
        selectionCategory.length === 0 || selectionCategory.includes(competence.categorie!)
      const searchFiltered = competence.competence_nom!.toLowerCase().includes(search)
      return maitrisesFiltered && categoriesFiltered && searchFiltered
    })
  })

  async onMaitriseChange(competenceId: string, newMaitrise: string) {
    const targetId = this.eleveTargetId() ?? this.profile()?.id
    if (!targetId) return
    try {
      await this.livretApprentissageService.updateCompetence(targetId, competenceId, newMaitrise)
      this.feedbackMessage.successFeedbackMessage('Succes', "La maitrise de l'élève à été modifier avec succès !")
      this.resourceCompetences.reload()
    } catch (error: any) {
      const errorCode = error?.code || 'Erreur inconnue'
      const errorDetail = error?.message || "Une erreur inattendue s'est produite lors de la modification."
      this.feedbackMessage.errorFeedbackMessage(errorCode, errorDetail)
    }
  }
}
