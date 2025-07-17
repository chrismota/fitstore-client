import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PixService {
  generatePixCode(): Observable<{ code: string }> {
    const pixCode =
      '00020126420014BR.GOV.BCB.PIX5204000053039865802BR5925FITSTORE6009SÃO PAULO62070503***6304ABCD';
    return of({ code: pixCode });
  }
}
