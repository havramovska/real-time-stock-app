import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StockApiService, StockApiResponse } from '../stock-api.interface';

@Injectable({
  providedIn: 'root'
})
export class MockApiService implements StockApiService {
  private mockData: StockApiResponse[] = [
    {
      symbol: 'AAPL',
      currentPrice: 150.25,
      priceChange: 2.15,
      percentageChange: 1.45,
      timestamp: Date.now() / 1000
    },
    {
      symbol: 'GOOGL',
      currentPrice: 2750.80,
      priceChange: -15.20,
      percentageChange: -0.55,
      timestamp: Date.now() / 1000
    },
    {
      symbol: 'MSFT',
      currentPrice: 320.45,
      priceChange: 8.75,
      percentageChange: 2.81,
      timestamp: Date.now() / 1000
    },
    {
      symbol: 'TSLA',
      currentPrice: 850.30,
      priceChange: 25.60,
      percentageChange: 3.10,
      timestamp: Date.now() / 1000
    }
  ];

  getQuote(symbol: string): Observable<StockApiResponse> {
    const stock = this.mockData.find(s => s.symbol === symbol);
    if (stock) {
      return of(this.generateRandomUpdate(stock)).pipe(delay(100));
    }
    return of(this.createMockStock(symbol)).pipe(delay(100));
  }

  getMultipleQuotes(symbols: string[]): Observable<StockApiResponse[]> {
    const quotes = symbols.map(symbol => {
      const stock = this.mockData.find(s => s.symbol === symbol);
      return stock ? this.generateRandomUpdate(stock) : this.createMockStock(symbol);
    });
    return of(quotes).pipe(delay(200));
  }

  getSymbols(exchange: string = 'US'): Observable<any[]> {
    return of(this.mockData.map(stock => ({
      symbol: stock.symbol,
      description: `${stock.symbol} Stock`,
      type: 'Common Stock'
    }))).pipe(delay(100));
  }

  private generateRandomUpdate(stock: StockApiResponse): StockApiResponse {
    const priceChange = (Math.random() - 0.5) * 10;
    const newPrice = stock.currentPrice + priceChange;
    const percentageChange = (priceChange / stock.currentPrice) * 100;

    return {
      ...stock,
      currentPrice: Math.round(newPrice * 100) / 100,
      priceChange: Math.round(priceChange * 100) / 100,
      percentageChange: Math.round(percentageChange * 100) / 100,
      timestamp: Date.now() / 1000
    };
  }

  private createMockStock(symbol: string): StockApiResponse {
    return {
      symbol,
      currentPrice: 100 + Math.random() * 200,
      priceChange: (Math.random() - 0.5) * 10,
      percentageChange: (Math.random() - 0.5) * 5,
      timestamp: Date.now() / 1000
    };
  }
} 