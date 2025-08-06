import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StockData } from '../../../features/stocks/models/stock-data.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StockWebSocketService {
  private ws: WebSocket | null = null;
  private stockDataSubject = new BehaviorSubject<StockData[]>([]);
  public stockData$ = this.stockDataSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (!environment.websocketUrl) {
      console.error('WebSocket URL not configured');
      return;
    }

    try {
      this.ws = new WebSocket(environment.websocketUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.subscribeToUpdates();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'stock-update') {
            this.stockDataSubject.next(message.data);
          } else if (message.type === 'subscribed') {
            console.log('Subscribed to stock updates:', message.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        setTimeout(() => this.connect(), 5000);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  private subscribeToUpdates(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe' }));
    }
  }

  getLiveUpdates(): Observable<StockData[]> {
    return this.stockData$;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
