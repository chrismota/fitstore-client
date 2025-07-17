import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageModalService {
  private _title = signal<string | null>('');
  private _message = signal<string | null>('');
  private _type = signal<'SUCCESS' | 'ERROR' | null>(null);

  title = this._title.asReadonly();
  message = this._message.asReadonly();
  type = this._type.asReadonly();

  buildSuccessMessage(message: string) {
    this.buildMessage('Sucesso', message, 'SUCCESS');
  }

  buildErrorMessage(message: string) {
    this.buildMessage('Erro', message, 'ERROR');
  }

  private buildMessage(
    title: string,
    message: string,
    type: 'SUCCESS' | 'ERROR'
  ) {
    this._title.set(title);
    this._message.set(message);
    this._type.set(type);
  }

  clearMessage() {
    this._title.set(null);
    this._message.set(null);
    this._type.set(null);
  }
}
