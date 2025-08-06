import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockStateService } from '../../state/stock.state';
import { StockQuote } from '../../../../domain/entities/stock.entity';
import { StockPresentationAdapter } from '../adapters/stock-presentation.adapter';
import { StockWebSocketService } from '../../../../data/sources/websocket/stock-websocket.service';
import { StockWithUIState as StockData } from '@real-time-stock-app/models';

@Injectable({
  providedIn: 'root'
})
export class StockPresentationService implements OnDestroy {
  private websocketSubscription: Subscription | null = null;

  constructor(
    private stockStateService: StockStateService,
    private stockPresentationAdapter: StockPresentationAdapter,
    private stockWebSocketService: StockWebSocketService
  ) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    this.websocketSubscription = this.stockWebSocketService.getLiveUpdates().subscribe({
      next: (stocks: StockData[]) => {
        const stockQuotes: StockQuote[] = stocks.map(stock => ({
          symbol: stock.symbol,
          currentPrice: stock.currentPrice,
          change: stock.priceChange,
          changePercent: stock.percentageChange,
          previousClose: stock.currentPrice - stock.priceChange,
          open: stock.currentPrice,
          high: stock.currentPrice,
          low: stock.currentPrice,
          lastUpdated: new Date(stock.lastTradeTime),
          dailyHigh: stock.dailyHigh,
          dailyLow: stock.dailyLow,
          weekHigh52: stock.weekHigh52,
          weekLow52: stock.weekLow52
        }));

        this.stockStateService.setStocks(stockQuotes);
        this.stockStateService.setLoading(false);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
        this.stockStateService.setError('Failed to connect to real-time updates');
      }
    });
  }

  loadStocks(): Observable<StockQuote[]> {
    this.stockStateService.setLoading(true);
    return this.getStocks();
  }

  loadStocksBySymbols(symbols: string[]): Observable<StockQuote[]> {
    this.stockStateService.setLoading(true);
    this.stockStateService.setSelectedSymbols(symbols);
    return this.getStocks();
  }

  toggleStock(symbol: string, isActive: boolean): void {
    this.stockStateService.toggleStock(symbol, isActive);
    this.stockWebSocketService.toggleStock(symbol, isActive);
  }

  getState(): Observable<any> {
    return this.stockStateService.getState();
  }

  getStocks(): Observable<StockQuote[]> {
    return this.stockStateService.getState().pipe(
      map(state => state.stocks)
    );
  }

  getStocksForUI(): Observable<any[]> {
    return this.stockStateService.getState().pipe(
      map(state => {
        return this.stockPresentationAdapter.transformToUIStateList(state.stocks, state.activeStocks);
      })
    );
  }

  getLoading(): Observable<boolean> {
    return this.stockStateService.getState().pipe(
      map(state => state.loading)
    );
  }

  getError(): Observable<string | null> {
    return this.stockStateService.getState().pipe(
      map(state => state.error)
    );
  }

  clearError(): void {
    this.stockStateService.clearError();
  }

  ngOnDestroy(): void {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
    this.stockWebSocketService.disconnect();
  }
} 