import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: any): void {
    console.log('[LOG]', message);
  }

  error(message: any): void {
    console.error('[ERROR]', message);
  }

  warn(message: any): void {
    console.warn('[WARN]', message);
  }
}
