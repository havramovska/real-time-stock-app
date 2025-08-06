import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StockWithUIState as StockData } from '@real-time-stock-app/models';
import { environment } from '../../../../environments/environment';
import { LoggerService } from '../../../core/services/logger.service';

@Injectable({ providedIn: 'root' })
export class StockWebSocketService {
  private ws: WebSocket | null = null;
  private stockDataSubject = new BehaviorSubject<StockData[]>([]);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  public stockData$ = this.stockDataSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor(private logger: LoggerService) {
    this.connect();
  }

  private connect(): void {
    if (!environment.websocketUrl) {
      this.logger.error('WebSocket URL not configured');
      return;
    }

    try {
      this.ws = new WebSocket(environment.websocketUrl);

      this.ws.onopen = () => {
        this.logger.log('WebSocket connected');
        this.connectionStatusSubject.next(true);
        this.subscribeToUpdates();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'stock-update') {
            const transformedData = message.data.map((stock: { symbol: string; name?: string; currentPrice: number; priceChange: number; percentageChange: number; lastTradeTime: string; dailyHigh?: number; dailyLow?: number; weekHigh52?: number; weekLow52?: number; isActive?: boolean }) => ({
              symbol: stock.symbol,
              name: stock.name || stock.symbol,
              currentPrice: stock.currentPrice,
              priceChange: stock.priceChange,
              percentageChange: stock.percentageChange,
              lastTradeTime: stock.lastTradeTime,
              dailyHigh: stock.dailyHigh || 0,
              dailyLow: stock.dailyLow || 0,
              weekHigh52: stock.weekHigh52 || 0,
              weekLow52: stock.weekLow52 || 0,
              isActive: stock.isActive || false
            }));
            
            this.stockDataSubject.next(transformedData);
          }
        } catch (error) {
          this.logger.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        this.logger.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        this.logger.warn('WebSocket disconnected, reconnecting...');
        this.connectionStatusSubject.next(false);
        setTimeout(() => this.connect(), 5000);
      };

    } catch (error) {
      this.logger.error('Failed to create WebSocket connection:', error);
    }
  }

  private subscribeToUpdates(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe' }));
    }
  }

  toggleStock(symbol: string, isActive: boolean): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'toggle-stock',
        symbol,
        isActive
      }));
    }
  }

  getLiveUpdates(): Observable<StockData[]> {
    return this.stockData$.pipe(
      tap((data) => {
        if (data && data.length > 0) {
          this.logger.log('Live update processed:', {
            timestamp: new Date().toISOString(),
            activeStocks: data.filter(stock => stock.isActive).map(stock => stock.symbol),
            totalStocks: data.length
          });
        }
      })
    );
  }

  disconnect(): void {
    if (this.ws) {
      this.logger.log('Manually disconnecting WebSocket...');
      this.ws.close();
      this.ws = null;
      this.connectionStatusSubject.next(false);
    }
  }
} 