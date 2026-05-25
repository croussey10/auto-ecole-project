import {Component, inject, input} from '@angular/core';
import {AuthCard} from '../../../shared/components/auth-card/auth-card';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {ProfileService} from '../../../core/services/auth/profile-service';
import {RouterLink} from '@angular/router';
import {Password} from 'primeng/password';
import {AutoEcoleService} from '../../../core/services/database/auto-ecole-service';
import {ProfileRoutingService} from '../../../core/services/auth/profile-routing-service';
import {AuthService} from '../../../core/services/auth/auth-service';

@Component({
  selector: 'app-login',
  imports: [AuthCard, InputText, ReactiveFormsModule, Button, RouterLink, Password],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  profileRoutingService = inject(ProfileRoutingService)
  autoEcoleService = inject(AutoEcoleService)

  schoolSlug = input<string>()

  profileService = inject(ProfileService)
  authService = inject(AuthService)

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
    const autoEcole = await this.autoEcoleService.getAutoEcoleInfos(this.schoolSlug(), 'slug')
    if (!autoEcole) return
    this.profileService.activeAutoEcoleId.set(autoEcole.id)
    localStorage.setItem('activeAutoEcoleId', autoEcole.id)
    const {user} = await this.authService.login(email, password)
    if (!user) return
    const profile = await this.profileService.getProfileInfos(user.id, autoEcole.id)
    if (!profile) return
    this.profileService.currentProfile.set(profile)
    this.profileRoutingService.redirectUrlByRole(profile.role)
  }
}
