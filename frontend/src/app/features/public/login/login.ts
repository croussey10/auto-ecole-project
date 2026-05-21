import { Component, inject } from '@angular/core';
import { AuthCard } from '../../../shared/layouts/auth-card/auth-card';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { AuthService } from '../../../core/services/auth/auth-service';
import { ProfileService } from '../../../core/services/auth/profile-service';

@Component({
  selector: 'app-login',
  imports: [AuthCard, InputText, ReactiveFormsModule, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authService = inject(AuthService)
  profileService = inject(ProfileService)

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
  });

  async submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const {email, password} = this.form.getRawValue()
    await this.login(email, password)
  }

  async login(email: string, password: string) {
    await this.profileService.login(email, password)
  }
}
