import {Component, input} from '@angular/core'
import {Card} from 'primeng/card'
import {Database} from '../../../types/database.types';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-eleve-past-lesson-card',
  imports: [Card, DatePipe],
  templateUrl: './eleve-past-lesson-card.html',
  styleUrl: './eleve-past-lesson-card.scss',
})
export class ElevePastLessonCard {
  reservation = input.required<Database['public']['Views']['view_reservation']['Row']>()
  personRole = input.required<string>()
  personName = input.required<string>()
}
