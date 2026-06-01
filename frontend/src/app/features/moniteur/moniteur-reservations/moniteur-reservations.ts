import { Component } from '@angular/core'
import { Carousel } from 'primeng/carousel'
import { Button } from 'primeng/button'
import { MoniteurPastLessonsList } from '../moniteur-past-lessons-list/moniteur-past-lessons-list'
import { MoniteurNextLessonsList } from '../moniteur-next-lessons-list/moniteur-next-lessons-list'

@Component({
  selector: 'app-moniteur-reservations',
  imports: [Carousel, Button, MoniteurPastLessonsList, MoniteurNextLessonsList],
  templateUrl: './moniteur-reservations.html',
  styleUrl: './moniteur-reservations.scss',
})
export class MoniteurReservations {
  pageActive: number = 0
  listePages = ['past', 'next']

  changerPage(index: number) {
    this.pageActive = index
  }
}
