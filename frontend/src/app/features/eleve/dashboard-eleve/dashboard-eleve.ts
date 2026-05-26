import { Component } from '@angular/core'
import { NextLessonsList } from '../next-lessons-list/next-lessons-list'

@Component({
  selector: 'app-dashboard-eleve',
  imports: [NextLessonsList],
  templateUrl: './dashboard-eleve.html',
  styleUrl: './dashboard-eleve.scss',
})
export class DashboardEleve {}
