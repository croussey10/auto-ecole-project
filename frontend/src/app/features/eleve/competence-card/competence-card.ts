import { Component, computed, input } from '@angular/core'
import { Database } from '../../../types/database.types'
import { Card } from 'primeng/card'
import { Tag } from 'primeng/tag'

@Component({
  selector: 'app-competence-card',
  imports: [Card, Tag],
  templateUrl: './competence-card.html',
  styleUrl: './competence-card.scss',
})
export class CompetenceCard {
  competence = input.required<Database['public']['Views']['view_livret_competence']['Row']>()

  severity = computed(() => {
    const maitrise = this.competence().maitrise
    switch (maitrise) {
      case 'Neutre':
        return 'secondary'
      case 'A revoir':
        return 'danger'
      case 'Moyen':
        return 'warn'
      case 'Acquis':
        return 'success'
      default:
        return 'success'
    }
  })
}
