import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StockWithUIState as StockData } from '@real-time-stock-app/models';
import { MOCK_STOCK_DATA } from '../sources/mocks';
import { environment } from '../../../environments/environment';
import { StockApiService } from '../sources/api/stock-api.interface';
import { STOCK_API_SERVICE } from '../sources/api/api-providers.config';
import { StockAdapter } from '../adapters/stock.adapter';
import { STOCK_SYMBOLS } from '../../core/constants/stock-symbols.const';
import { StockRepository as IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { StockQuote } from '../../domain/entities/stock.entity';
import { ApiToDomainMapper } from '../mappers/api-to-domain-mapper';

@Injectable({ providedIn: 'root' })
export class StockRepository implements IStockRepository {
  private readonly defaultSymbols = [...STOCK_SYMBOLS];

  constructor(
    @Inject(STOCK_API_SERVICE) private stockApiService: StockApiService,
    private stockAdapter: StockAdapter,
    private apiToDomainMapper: ApiToDomainMapper
  ) {}

  getStocks(): Observable<StockData[]> {
    if (environment.useMockData) {
      return of(MOCK_STOCK_DATA);
    }

    if (!environment.finnhubApiKey) {
      console.warn('API key not configured, using mock data');
      return of(MOCK_STOCK_DATA);
    }

    return this.stockApiService.getMultipleQuotes(this.defaultSymbols)
      .pipe(
        map(apiResponses => {
          const stocks = this.stockAdapter.transformApiResponsesToStocks(apiResponses);
          return this.stockAdapter.transformToStocksWithUIState(stocks, false);
        }),
        catchError(error => {
          console.error('Failed to fetch from API:', error);
          console.warn('Falling back to mock data');
          return of(MOCK_STOCK_DATA);
        })
      );
  }

  getStocksBySymbols(symbols: string[]): Observable<StockData[]> {
    if (environment.useMockData) {
      const filteredMockData = MOCK_STOCK_DATA.filter(stock => 
        symbols.includes(stock.symbol)
      );
      return of(filteredMockData);
    }

    if (!environment.finnhubApiKey || environment.finnhubApiKey === 'YOUR_FINNHUB_API_KEY') {
      console.warn('API key not configured, using mock data');
      const filteredMockData = MOCK_STOCK_DATA.filter(stock => 
        symbols.includes(stock.symbol)
      );
      return of(filteredMockData);
    }

    return this.stockApiService.getMultipleQuotes(symbols)
      .pipe(
        map(apiResponses => {
          const stocks = this.stockAdapter.transformApiResponsesToStocks(apiResponses);
          return this.stockAdapter.transformToStocksWithUIState(stocks, false);
        }),
        catchError(error => {
          console.error('Failed to fetch from API:', error);
          console.warn('Falling back to mock data');
          const filteredMockData = MOCK_STOCK_DATA.filter(stock => 
            symbols.includes(stock.symbol)
          );
          return of(filteredMockData);
        })
      );
  }

  getStockQuote(symbol: string): Observable<StockQuote> {
    if (environment.useMockData) {
      const mockStock = MOCK_STOCK_DATA.find(stock => stock.symbol === symbol);
      const stockData = mockStock || MOCK_STOCK_DATA[0];
      return of({
        symbol: stockData.symbol,
        currentPrice: stockData.currentPrice,
        change: stockData.priceChange,
        changePercent: stockData.percentageChange,
        previousClose: stockData.currentPrice - stockData.priceChange,
        open: stockData.currentPrice,
        high: stockData.currentPrice,
        low: stockData.currentPrice,
        volume: stockData.volume,
        lastUpdated: new Date()
      });
    }

    if (!environment.finnhubApiKey || environment.finnhubApiKey === 'YOUR_FINNHUB_API_KEY') {
      console.warn('API key not configured, using mock data');
      const mockStock = MOCK_STOCK_DATA.find(stock => stock.symbol === symbol);
      const stockData = mockStock || MOCK_STOCK_DATA[0];
      return of({
        symbol: stockData.symbol,
        currentPrice: stockData.currentPrice,
        change: stockData.priceChange,
        changePercent: stockData.percentageChange,
        previousClose: stockData.currentPrice - stockData.priceChange,
        open: stockData.currentPrice,
        high: stockData.currentPrice,
        low: stockData.currentPrice,
        volume: stockData.volume,
        lastUpdated: new Date()
      });
    }

    return this.stockApiService.getQuote(symbol)
      .pipe(
        map(apiResponse => this.apiToDomainMapper.mapQuoteToDomain(apiResponse, symbol)),
        catchError(error => {
          console.error('Failed to fetch quote from API:', error);
          console.warn('Falling back to mock data');
          const mockStock = MOCK_STOCK_DATA.find(stock => stock.symbol === symbol);
          const stockData = mockStock || MOCK_STOCK_DATA[0];
          return of({
            symbol: stockData.symbol,
            currentPrice: stockData.currentPrice,
            change: stockData.priceChange,
            changePercent: stockData.percentageChange,
            previousClose: stockData.currentPrice - stockData.priceChange,
            open: stockData.currentPrice,
            high: stockData.currentPrice,
            low: stockData.currentPrice,
            volume: stockData.volume,
            lastUpdated: new Date()
          });
        })
      );
  }

  getMultipleStockQuotes(symbols: string[]): Observable<StockQuote[]> {
    return this.stockApiService.getMultipleQuotes(symbols).pipe(
      map(apiResponses => {
        return apiResponses.map((response, index) => 
          this.apiToDomainMapper.mapQuoteToDomain(response, symbols[index])
        );
      }),
      catchError(error => {
        console.error('Failed to fetch multiple quotes:', error);
        return of([]);
      })
    );
  }
}
