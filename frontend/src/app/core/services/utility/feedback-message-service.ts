import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class FeedbackMessageService {
  messageService = inject(MessageService)

  errorFeedbackMessage(errorStatus: any, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: `Erreur : ${errorStatus}`,
      detail: detail
    })
  }

  successFeedbackMessage(summary: any, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: `Success : ${summary}`,
      detail: detail
    })
  }
}
