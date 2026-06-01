import {Component, input} from '@angular/core'
import {Card} from 'primeng/card'
import {Database} from '../../../types/database.types';

@Component({
  selector: 'app-eleve-past-lesson-card',
  imports: [Card],
  templateUrl: './eleve-past-lesson-card.html',
  styleUrl: './eleve-past-lesson-card.scss',
})
export class ElevePastLessonCard {

  reservation = input.required<Database["public"]["Views"]["view_reservations"]["Row"]>()
  personRole = input.required<string>()
  personName = input.required<string>()

}
