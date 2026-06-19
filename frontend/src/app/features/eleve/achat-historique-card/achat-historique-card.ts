import { Component, input } from '@angular/core'
import { Database } from '../../../types/database.types'
import { Card } from 'primeng/card'
import { CurrencyPipe, DatePipe } from '@angular/common'

@Component({
  selector: 'app-achat-historique-card',
  imports: [Card, CurrencyPipe, DatePipe],
  templateUrl: './achat-historique-card.html',
  styleUrl: './achat-historique-card.scss',
})
export class AchatHistoriqueCard {
  achat = input.required<Database['public']['Tables']['achat_historique']['Row']>()
}
