import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(...args: any[]): void {
    console.log('[LOG]', ...args);
  }

  error(...args: any[]): void {
    console.error('[ERROR]', ...args);
  }

  warn(...args: any[]): void {
    console.warn('[WARN]', ...args);
  }

  info(...args: any[]): void {
    console.info('[INFO]', ...args);
  }
}
