import { Component, inject, input } from '@angular/core';
import { MessageModalService } from '../../../core/services/messageModal.service';

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.scss',
})
export class MesssageModalComponent {
  title = input<string | null>();
  message = input<string | null>();
  type = input<string | null>();
  public messageModalService = inject(MessageModalService);

  isType(type: string): boolean {
    return this.type() === type;
  }

  onCloseModal(): void {
    this.messageModalService.clearMessage();
  }
}
