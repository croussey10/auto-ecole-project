import { Component, computed, input, output } from '@angular/core'
import { Database } from '../../../types/database.types'
import { Tag } from 'primeng/tag'
import { Select } from 'primeng/select'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-competence-card',
  imports: [Tag, Select, FormsModule],
  templateUrl: './competence-card.html',
  styleUrl: './competence-card.scss',
})
export class CompetenceCard {
  competence = input.required<Database['public']['Views']['view_livret_competence']['Row']>()

  canEditMaitrise = input.required<boolean>()

  maitriseChanged = output<{ competenceId: string; newMaitrise: string }>()
  maitriseOptions = ['Neutre', 'A revoir', 'Moyen', 'Acquis']

  onChange(event: any) {
    this.maitriseChanged.emit({
      competenceId: this.competence().competence_id!,
      newMaitrise: event.value,
    })
  }

  color = computed(() => {
    const maitrise = this.competence().maitrise
    switch (maitrise) {
      case 'Neutre':
        return 'var(--p-slate-400)'
      case 'A revoir':
        return 'var(--p-red-500)'
      case 'Moyen':
        return 'var(--p-amber-500)'
      case 'Acquis':
        return 'var(--p-emerald-500)'
      default:
        return 'var(--p-emerald-500)'
    }
  })

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
