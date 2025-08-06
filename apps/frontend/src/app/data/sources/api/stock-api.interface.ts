import { Observable } from 'rxjs';
import { Stock } from '@real-time-stock-app/models';

export interface StockApiResponse {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
  timestamp: number;
  dailyHigh: number;
  dailyLow: number;
  weekHigh52: number;
  weekLow52: number;
}

export interface StockApiService {
  getQuote(symbol: string): Observable<StockApiResponse>;
  getMultipleQuotes(symbols: string[]): Observable<StockApiResponse[]>;
  getSymbols(exchange?: string): Observable<any[]>;
} 