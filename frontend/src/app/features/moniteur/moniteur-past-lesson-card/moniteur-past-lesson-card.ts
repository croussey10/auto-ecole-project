import {Component, effect, inject, input, signal} from '@angular/core'
import {Card} from 'primeng/card'
import {Database} from '../../../types/database.types';
import {Textarea} from 'primeng/textarea';
import {Button} from 'primeng/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReservationService} from '../../../core/services/database/reservation-service';
import {FeedbackMessageService} from '../../../core/services/utility/feedback-message-service';

@Component({
  selector: 'app-moniteur-past-lesson-card',
  imports: [Card, Textarea, Button, FormsModule, ReactiveFormsModule],
  templateUrl: './moniteur-past-lesson-card.html',
  styleUrl: './moniteur-past-lesson-card.scss',
})
export class MoniteurPastLessonCard {
  feedbackMessageService = inject(FeedbackMessageService)
  reservationService = inject(ReservationService)

  loadingSubmit = signal<boolean>(false);
  reservation = input.required<Database["public"]["Views"]["view_reservation"]["Row"]>()
  personRole = input.required<string>()
  personName = input.required<string>()

  oldCommentaire = signal<string | null>(null)

  form = new FormGroup({
    commentaire: new FormControl('', {
      validators: [Validators.maxLength(150)],
    })
  })

  constructor() {
    effect(() => {
      const reservation = this.reservation
      this.oldCommentaire.set(reservation().commentaire_moniteur)
      this.form.patchValue({
        commentaire: reservation().commentaire_moniteur
      })
    });
  }

  async submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const {commentaire} = this.form.getRawValue()

    if (this.oldCommentaire() == commentaire) return

    this.loadingSubmit.set(true)

    try {
      await this.reservationService.updateCommentaireMoniteur(this.reservation().id!, commentaire!)
      this.oldCommentaire.set(commentaire)
      this.feedbackMessageService.successFeedbackMessage('Succes', "commentaire modifier !")
    } catch (error: any) {
      this.feedbackMessageService.errorFeedbackMessage(error.status, "Erreur lors de la modification du commentaire !")
    } finally {
      this.loadingSubmit.set(false)
    }
  }

}
