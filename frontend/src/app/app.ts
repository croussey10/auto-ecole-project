import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthCard } from './shared/layouts/auth-card/auth-card';
import { Login } from './features/public/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthCard, Login],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
}
