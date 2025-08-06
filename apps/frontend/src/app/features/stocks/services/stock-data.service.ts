import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StockWithUIState as StockData } from '@real-time-stock-app/models';
import { StockRepository } from '../../../data/repositories/stock.repository';
import { StockWebSocketService } from '../../../data/sources/websocket/stock-websocket.service';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private stockRepository = inject(StockRepository);
  private websocketService = inject(StockWebSocketService);
  
  private stocksSubject = new BehaviorSubject<StockData[]>([]);
  public stocks$: Observable<StockData[]> = this.stocksSubject.asObservable();
  
  private subscription = new Subscription();

  initializeStocks(): void {
    this.subscription.add(
      this.stockRepository.getStocks().subscribe((stocks: StockData[]) => {
        this.stocksSubject.next(stocks);
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
  }

  private updateStocksWithLiveData(updates: StockData[]): void {
    const currentStocks = this.stocksSubject.value;
    
    updates.forEach((update: StockData) => {
      const existingStockIndex = currentStocks.findIndex((s: StockData) => s.symbol === update.symbol);
      
      if (existingStockIndex !== -1) {
        const currentStock = currentStocks[existingStockIndex];
        // Only update if the stock is active (live updates enabled for this stock)
        if (currentStock.isActive) {
          // Preserve the isActive status from the current stock
          currentStocks[existingStockIndex] = { 
            ...currentStock, 
            ...update,
            isActive: currentStock.isActive // Keep the original isActive value
          };
        }
      } else {
        // For new stocks, set isActive to false by default
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
    }
  }

  getCurrentStocks(): StockData[] {
    return this.stocksSubject.value;
  }

  cleanup(): void {
    this.subscription.unsubscribe();
  }
} 