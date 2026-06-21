import { Component, inject, input, signal } from '@angular/core'
import { AuthCard } from '../../../shared/components/auth-card/auth-card'
import { InputText } from 'primeng/inputtext'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Button } from 'primeng/button'
import { ProfileService } from '../../../core/services/auth/profile-service'
import { Router, RouterLink } from '@angular/router'
import { Password } from 'primeng/password'
import { AutoEcoleService } from '../../../core/services/database/auto-ecole-service'
import { ProfileRoutingService } from '../../../core/services/auth/profile-routing-service'
import { AuthService } from '../../../core/services/auth/auth-service'
import { AuthError } from '@supabase/supabase-js'
import { FeedbackMessageService } from '../../../core/services/utility/feedback-message-service'

@Component({
  selector: 'app-login',
  imports: [AuthCard, InputText, ReactiveFormsModule, Button, RouterLink, Password],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router)
  feedbackMessageService = inject(FeedbackMessageService)
  profileRoutingService = inject(ProfileRoutingService)
  autoEcoleService = inject(AutoEcoleService)

  schoolSlug = input.required<string>()
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
  })

  async submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const { email, password } = this.form.getRawValue()
    this.loadingSubmit.set(true)

    try {
      await this.login(email, password)
    } catch (error) {
      const authError = error as AuthError
      const authErrorStatus = authError.status
      switch (authError.status) {
        case undefined:
          this.feedbackMessageService.errorFeedbackMessage(
            authErrorStatus,
            'Veuillez vérifier que vous etes connecté à internet !',
          )
          break
        case 400:
          this.feedbackMessageService.errorFeedbackMessage(
            authErrorStatus,
            'Email ou mot de passe incorrect !',
          )
          break
        default:
          this.feedbackMessageService.errorFeedbackMessage(
            authErrorStatus,
            'Une erreur est survenue !',
          )
          break
      }
    } finally {
      this.loadingSubmit.set(false)
    }
  }

  async login(email: string, password: string) {
    const slug = this.schoolSlug()
    if (!slug) return
    const autoEcole = await this.autoEcoleService.getAutoEcoleInfos(slug, 'slug')
    if (!autoEcole) return

    const { user } = await this.authService.login(email, password)
    if (!user) return

    try {
      const profile = await this.profileService.getProfileInfos(user.id, 'user', autoEcole.id)

      this.profileService.currentProfile.set(profile)
      this.profileRoutingService.redirectUrlByRole(profile.role)
    } catch (error: any) {
      if (error.code === 'PGRST116') {
        const firstProfile = await this.profileService.getFirstProfile(user.id)

        if (firstProfile) {
          const newProfile = await this.profileService.registerProfile(
            user.id,
            autoEcole.id,
            firstProfile.prenom,
            firstProfile.nom,
          )
          this.profileService.currentProfile.set(newProfile)
          this.profileRoutingService.redirectUrlByRole(newProfile.role)
          this.feedbackMessageService.successFeedbackMessage(
            'Bienvenue',
            `Vous avez rejoint ${autoEcole.nom} !`,
          )
        }
      } else {
        throw error
      }
    }
  }
}
