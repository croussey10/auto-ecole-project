import { Component, input } from '@angular/core'
import { TitleCasePipe } from '@angular/common'

@Component({
  selector: 'app-auth-card',
  imports: [TitleCasePipe],
  templateUrl: './auth-card.html',
  styleUrl: './auth-card.scss',
})
export class AuthCard {
  slug = input<string>('')
}
