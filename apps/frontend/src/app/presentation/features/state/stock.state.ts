import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StockQuote } from '../../../domain/entities/stock.entity';

export interface StockState {
  stocks: StockQuote[];
  loading: boolean;
  error: string | null;
  selectedSymbols: string[];
  activeStocks: Set<string>;
}

const initialState: StockState = {
  stocks: [],
  loading: false,
  error: null,
  selectedSymbols: [],
  activeStocks: new Set(['AAPL', 'GOOGL', 'MSFT', 'TSLA'])
};

@Injectable({
  providedIn: 'root'
})
export class StockStateService {
  private state$ = new BehaviorSubject<StockState>(initialState);

  getState(): Observable<StockState> {
    return this.state$.asObservable();
  }

  getCurrentState(): StockState {
    return this.state$.value;
  }

  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setStocks(stocks: StockQuote[]): void {
    this.updateState({ stocks, loading: false, error: null });
  }

  addStock(stock: StockQuote): void {
    const currentState = this.getCurrentState();
    const existingIndex = currentState.stocks.findIndex(s => s.symbol === stock.symbol);
    
    if (existingIndex >= 0) {
      const updatedStocks = [...currentState.stocks];
      updatedStocks[existingIndex] = stock;
      this.updateState({ stocks: updatedStocks });
    } else {
      this.updateState({ stocks: [...currentState.stocks, stock] });
    }
  }

  setError(error: string): void {
    this.updateState({ error, loading: false });
  }

  setSelectedSymbols(symbols: string[]): void {
    this.updateState({ selectedSymbols: symbols });
  }

  toggleStock(symbol: string, isActive: boolean): void {
    const currentState = this.getCurrentState();
    const newActiveStocks = new Set(currentState.activeStocks);
    
    if (isActive) {
      newActiveStocks.add(symbol);
    } else {
      newActiveStocks.delete(symbol);
    }
    
    this.updateState({ activeStocks: newActiveStocks });
  }

  isStockActive(symbol: string): boolean {
    return this.getCurrentState().activeStocks.has(symbol);
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  private updateState(partialState: Partial<StockState>): void {
    const currentState = this.getCurrentState();
    const newState = { ...currentState, ...partialState };
    this.state$.next(newState);
  }
} 