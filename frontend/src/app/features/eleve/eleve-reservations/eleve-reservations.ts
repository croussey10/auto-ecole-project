import { Component } from '@angular/core'
import { Carousel } from 'primeng/carousel'
import { Button } from 'primeng/button'
import { ElevePastLessonsList } from '../eleve-past-lessons-list/eleve-past-lessons-list'
import { EleveNextLessonsList } from '../eleve-next-lessons-list/eleve-next-lessons-list'

@Component({
  selector: 'app-eleve-reservations',
  imports: [Carousel, Button, ElevePastLessonsList, EleveNextLessonsList],
  templateUrl: './eleve-reservations.html',
  styleUrl: './eleve-reservations.scss',
})
export class EleveReservations {
  pageActive: number = 0
  listePages = ['past', 'next']

  changerPage(index: number) {
    this.pageActive = index
  }
}
