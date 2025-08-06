import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StockQuote } from '../../../../domain/entities/stock.entity';
import { StockWithUIState } from '@real-time-stock-app/models';
import * as StockActions from '../store/actions/stock.actions';
import * as StockSelectors from '../store/selectors/stock.selectors';

@Injectable({
  providedIn: 'root'
})
export class StockNgRxService {
  constructor(private store: Store) {}

  getStocks(): Observable<StockQuote[]> {
    return this.store.select(StockSelectors.selectAllStocks);
  }

  getStocksWithUIState(): Observable<StockWithUIState[]> {
    return this.store.select(StockSelectors.selectStocksWithUIState);
  }

  getLoading(): Observable<boolean> {
    return this.store.select(StockSelectors.selectLoading);
  }

  getError(): Observable<string | null> {
    return this.store.select(StockSelectors.selectError);
  }

  getActiveStocks(): Observable<Set<string>> {
    return this.store.select(StockSelectors.selectActiveStocks);
  }

  getStockBySymbol(symbol: string): Observable<StockQuote | undefined> {
    return this.store.select(StockSelectors.selectStockBySymbol(symbol));
  }

  isStockActive(symbol: string): Observable<boolean> {
    return this.store.select(StockSelectors.selectIsStockActive(symbol));
  }

  loadStocks(): void {
    this.store.dispatch(StockActions.loadStocks());
  }

  updateStock(stock: StockQuote): void {
    this.store.dispatch(StockActions.updateStock({ stock }));
  }

  updateStocks(stocks: StockQuote[]): void {
    this.store.dispatch(StockActions.updateStocks({ stocks }));
  }

  toggleStockActive(symbol: string, isActive: boolean): void {
    this.store.dispatch(StockActions.toggleStockActive({ symbol, isActive }));
  }

  setSelectedSymbols(symbols: string[]): void {
    this.store.dispatch(StockActions.setSelectedSymbols({ symbols }));
  }

  clearError(): void {
    this.store.dispatch(StockActions.clearError());
  }
} 