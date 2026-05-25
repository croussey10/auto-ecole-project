import {Component, input} from '@angular/core';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Database} from '../../../types/database.types';

@Component({
  selector: 'app-next-lesson-card',
  imports: [Card, Button],
  templateUrl: './next-lesson-card.html',
  styleUrl: './next-lesson-card.scss',
})
export class NextLessonCard {
  reservation = input.required<Database['public']['Views']['view_eleve_reservations']['Row']>();
}
