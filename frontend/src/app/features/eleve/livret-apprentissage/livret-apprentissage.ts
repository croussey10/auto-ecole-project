import { Component, computed, inject, resource, signal } from '@angular/core'
import { LivretApprentissageService } from '../../../core/services/database/livret-apprentissage-service'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { Card } from 'primeng/card'
import { CompetenceCard } from '../competence-card/competence-card'
import { FormsModule } from '@angular/forms'
import { SelectButton } from 'primeng/selectbutton'
import { InputText } from 'primeng/inputtext'

@Component({
  selector: 'app-livret-apprentissage',
  imports: [Card, CompetenceCard, FormsModule, SelectButton, InputText],
  templateUrl: './livret-apprentissage.html',
  styleUrl: './livret-apprentissage.scss',
})
export class LivretApprentissage {
  livretApprentisageService = inject(LivretApprentissageService)
  profileService = inject(ProfileService)

  profile = this.profileService.currentProfile

  resourceCompetences = resource({
    params: () => this.profile(),
    loader: async ({ params }) => {
      if (!params) return
      return await this.livretApprentisageService.getCompetencesOfLivret(params.id)
    },
  })
  competences = this.resourceCompetences.value

  selectedMaitrises = signal<string[]>([])
  selectedCategories = signal<string[]>([])
  search = signal<string>('')

  maitrises: any[] = [
    { label: 'Neutre', value: 'Neutre' },
    { label: 'A revoir', value: 'A revoir' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Acquis', value: 'Acquis' },
  ]
  categories: any[] = [
    { label: 'Maîtriser', value: 'Maîtriser' },
    { label: 'Appréhender', value: 'Appréhender' },
    { label: 'Pratiquer', value: 'Pratiquer' },
    { label: 'Circuler', value: 'Circuler' },
  ]

  filter = computed(() => {
    const listeCompetences = this.competences() || []
    const selectionMaitrise = this.selectedMaitrises() || []
    const selectionCategory = this.selectedCategories() || []
    const search = this.search()

    return listeCompetences.filter((competence) => {
      const maitrisesFiltred = selectionMaitrise.length === 0 || selectionMaitrise.includes(competence.maitrise!)
      const categoriesFiltred = selectionCategory.length === 0 || selectionCategory.includes(competence.categorie!)
      const searchFiltred = competence.competence_nom!.includes(search)
      return maitrisesFiltred && categoriesFiltred && searchFiltred
    })
  })
}
