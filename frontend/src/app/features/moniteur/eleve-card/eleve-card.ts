import { Component, input, output } from '@angular/core'
import { Database } from '../../../types/database.types'
import { Button } from 'primeng/button'

@Component({
  selector: 'app-eleve-card',
  imports: [Button],
  templateUrl: './eleve-card.html',
  styleUrl: './eleve-card.scss',
})
export class EleveCard {
  eleve = input.required<Database['public']['Tables']['profile']['Row']>()
  eleveToOpenLivret = output<Database['public']['Tables']['profile']['Row']>()

  clicLivret() {
    this.eleveToOpenLivret.emit(this.eleve())
  }
}
