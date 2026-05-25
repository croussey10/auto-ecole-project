import { Component } from '@angular/core';
import {NextLessonCard} from '../next-lesson-card/next-lesson-card';

@Component({
  selector: 'app-next-lessons-list',
  imports: [
    NextLessonCard
  ],
  templateUrl: './next-lessons-list.html',
  styleUrl: './next-lessons-list.scss',
})
export class NextLessonsList {}
