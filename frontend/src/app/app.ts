import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthCard } from './shared/components/auth-card/auth-card';
import { Login } from './features/public/login/login';
import {Navbar} from './shared/layouts/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthCard, Login, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
}
