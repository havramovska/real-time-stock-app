import { StockQuote } from '../entities/stock.entity';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export const STOCK_REPOSITORY = new InjectionToken<StockRepository>('StockRepository');

export interface StockRepository {
  getStockQuote(symbol: string): Observable<StockQuote>;
  getMultipleStockQuotes(symbols: string[]): Observable<StockQuote[]>;
} 