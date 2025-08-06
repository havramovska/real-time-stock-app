import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { StockWithUIState as StockData } from '@real-time-stock-app/models';
import { StockRepository } from '../../../../data/repositories/stock.repository';
import { StockWebSocketService } from '../../../../data/sources/websocket/stock-websocket.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private stockRepository = inject(StockRepository);
  private websocketService = inject(StockWebSocketService);
  private logger = inject(LoggerService);

  private stocksSubject = new BehaviorSubject<StockData[]>([]);
  public stocks$: Observable<StockData[]> = this.stocksSubject.asObservable();

  private subscription = new Subscription();

  initializeStocks(): void {
    this.subscription.add(
      this.stockRepository.getStocks().subscribe((stocks: StockData[]) => {
        this.stocksSubject.next(stocks);
        this.logger.log('Initial stock data loaded:', {
          source: environment.useMockData ? 'Mock Data' : 'Finnhub API',
          count: stocks.length,
          symbols: stocks.map(stock => stock.symbol)
        });
      })
    );
  }

  subscribeToLiveUpdates(): void {
    this.subscription.add(
      this.websocketService.getLiveUpdates().subscribe((updates: StockData[]) => {
        if (updates.length > 0) {
          this.updateStocksWithLiveData(updates);
        }
      })
    );

    this.logger.log('WebSocket connection established for real-time updates');
  }

  private updateStocksWithLiveData(updates: StockData[]): void {
    const currentStocks = this.stocksSubject.value;

    updates.forEach((update: StockData) => {
      const existingStockIndex = currentStocks.findIndex((s: StockData) => s.symbol === update.symbol);

      if (existingStockIndex !== -1) {
        const currentStock = currentStocks[existingStockIndex];
        if (currentStock.isActive) {
          currentStocks[existingStockIndex] = {
            ...currentStock,
            ...update,
            isActive: currentStock.isActive
          };
        }
      } else {
        currentStocks.push({ ...update, isActive: false });
      }
    });

    this.stocksSubject.next([...currentStocks]);
  }

  updateStockActiveStatus(symbol: string, isActive: boolean): void {
    const currentStocks = this.stocksSubject.value;
    const stockIndex = currentStocks.findIndex((s: StockData) => s.symbol === symbol);

    if (stockIndex !== -1) {
      currentStocks[stockIndex] = { ...currentStocks[stockIndex], isActive };
      this.stocksSubject.next([...currentStocks]);

      this.logger.log(`Stock ${symbol} ${isActive ? 'activated' : 'deactivated'}:`, {
        symbol,
        isActive,
        totalActive: currentStocks.filter(stock => stock.isActive).length
      });
    }
  }

  getCurrentStocks(): StockData[] {
    return this.stocksSubject.value;
  }

  cleanup(): void {
    this.logger.log('Cleaning up stock data service subscriptions');
    this.subscription.unsubscribe();
  }
} 