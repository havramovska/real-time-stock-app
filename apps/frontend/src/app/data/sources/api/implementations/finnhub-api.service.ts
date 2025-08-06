import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { StockApiService, StockApiResponse, StockSymbol } from '../stock-api.interface';
import { 
  FinnhubQuoteResponse, 
  FinnhubSymbol 
} from '@real-time-stock-app/models';

@Injectable({
  providedIn: 'root'
})
export class FinnhubApiService implements StockApiService {
  private readonly baseUrl = environment.finnhubBaseUrl;
  private readonly apiKey = environment.finnhubApiKey;

  constructor(private http: HttpClient) {}

  getQuote(symbol: string): Observable<StockApiResponse> {
    const quoteUrl = `${this.baseUrl}/quote`;
    const quoteParams = { symbol, token: this.apiKey };
    
    const metricsUrl = `${this.baseUrl}/stock/metric`;
    const metricsParams = { symbol, metric: 'all', token: this.apiKey };

    return forkJoin({
      quote: this.http.get<FinnhubQuoteResponse>(quoteUrl, { params: quoteParams }),
      metrics: this.http.get<any>(metricsUrl, { params: metricsParams }).pipe(
        catchError(() => of(null))
      )
    }).pipe(
      map(({ quote, metrics }) => {
        let weekHigh52 = 0;
        let weekLow52 = 0;
        
        if (metrics && metrics.metric) {
          weekHigh52 = metrics.metric['52WeekHigh'] || 0;
          weekLow52 = metrics.metric['52WeekLow'] || 0;
        }
        
        return this.transformQuoteResponse(symbol, quote, weekHigh52, weekLow52);
      }),
      catchError(this.handleError)
    );
  }

  getMultipleQuotes(symbols: string[]): Observable<StockApiResponse[]> {
    const quoteRequests = symbols.map(symbol => this.getQuote(symbol));

    return new Observable(observer => {
      const results: StockApiResponse[] = [];
      let completed = 0;

      quoteRequests.forEach((request, index) => {
        request.subscribe({
          next: (quote) => {
            results[index] = quote;
            completed++;
            if (completed === symbols.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    });
  }

  getSymbols(exchange: string = 'US'): Observable<StockSymbol[]> {
    const url = `${this.baseUrl}/stock/symbol`;
    const params = { exchange, token: this.apiKey };

    return this.http.get<FinnhubSymbol[]>(url, { params })
      .pipe(
        map(finnhubSymbols => finnhubSymbols.map(finnhubSymbol => ({
          symbol: finnhubSymbol.symbol,
          name: finnhubSymbol.description || finnhubSymbol.displaySymbol,
          exchange: exchange
        }))),
        catchError(this.handleError)
      );
  }

  private transformQuoteResponse(symbol: string, quote: FinnhubQuoteResponse, weekHigh52: number, weekLow52: number): StockApiResponse {
    return {
      symbol: symbol.toUpperCase(),
      currentPrice: quote.c,
      priceChange: quote.d,
      percentageChange: quote.dp,
      timestamp: quote.t,
      dailyHigh: quote.h,
      dailyLow: quote.l,
      weekHigh52: weekHigh52,
      weekLow52: weekLow52
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Failed to fetch data'));
  }
} 