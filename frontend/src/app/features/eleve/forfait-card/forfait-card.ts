import { Component, input } from '@angular/core'
import { Database } from '../../../types/database.types'
import { Card } from 'primeng/card'
import { Button } from 'primeng/button'

@Component({
  selector: 'app-forfait-card',
  imports: [Card, Button],
  templateUrl: './forfait-card.html',
  styleUrl: './forfait-card.scss',
})
export class ForfaitCard {
  forfait = input.required<Database['public']['Tables']['forfait']['Row']>()
}
