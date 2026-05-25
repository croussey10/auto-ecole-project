import {Component, inject, input, signal} from '@angular/core';
import {AuthCard} from '../../../shared/components/auth-card/auth-card';
import {Button} from 'primeng/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ProfileService} from '../../../core/services/auth/profile-service';
import {RouterLink} from '@angular/router';
import {AutoEcoleService} from '../../../core/services/database/auto-ecole-service';
import {Password} from 'primeng/password';
import {ProfileRoutingService} from '../../../core/services/auth/profile-routing-service';
import {AuthService} from '../../../core/services/auth/auth-service';
import {AuthError} from '@supabase/supabase-js';
import {MessageService} from 'primeng/api';
import {FeedbackMessageService} from '../../../core/services/utility/feedback-message-service';

@Component({
  selector: 'app-register',
  imports: [
    AuthCard,
    Button,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    RouterLink,
    Password,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  feedbackMessageService = inject(FeedbackMessageService)
  profileRoutingService = inject(ProfileRoutingService)
  autoEcoleService = inject(AutoEcoleService)

  schoolSlug = input<string>()
  loadingSubmit = signal<boolean>(false)

  profileService = inject(ProfileService)
  authService = inject(AuthService)

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
  });

  async submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const {email, password} = this.form.getRawValue()

    this.loadingSubmit.set(true)
    try {
      await this.register(email, password)
    } catch (error) {
      const authError = error as AuthError
      const authErrorStatus = authError.status
      switch (authErrorStatus) {
        case undefined:
          this.feedbackMessageService.errorFeedbackMessage(authErrorStatus, "Veuillez vérifier que vous etes connecté à internet !")
          break
        case 422:
          this.feedbackMessageService.errorFeedbackMessage(authErrorStatus, "Adresse mail déjà utilisé !")
          break
        default:
          this.feedbackMessageService.errorFeedbackMessage(authErrorStatus, "Une erreur est survenue !")
          break
      }
    } finally {
      this.loadingSubmit.set(false)
    }
  }

  async register(email: string, password: string) {
    const {firstName, lastName} = this.form.getRawValue()
    const autoEcole = await this.autoEcoleService.getAutoEcoleInfos(this.schoolSlug(), 'slug')
    if (!autoEcole) return
    this.profileService.activeAutoEcoleId.set(autoEcole.id);
    this.profileService.activeAutoEcoleSlug.set(autoEcole.slug);
    localStorage.setItem('activeAutoEcoleId', autoEcole.id)
    localStorage.setItem('activeAutoEcoleSlug', autoEcole.slug)
    const {user} = await this.authService.register(email, password)
    if (!user) return
    const profile = await this.profileService.registerProfile(user.id, autoEcole.id, firstName, lastName)
    if (!profile) return
    this.profileService.currentProfile.set(profile)
    this.profileRoutingService.redirectUrlByRole(profile.role)
  }
}
