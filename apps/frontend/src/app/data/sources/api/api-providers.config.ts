import { Provider, InjectionToken } from '@angular/core';
import { StockApiService } from './stock-api.interface';
import { FinnhubApiService } from './implementations/finnhub-api.service';

export const STOCK_API_SERVICE = new InjectionToken<StockApiService>('StockApiService');

export const API_PROVIDERS: Provider[] = [
  {
    provide: STOCK_API_SERVICE,
    useClass: FinnhubApiService
  }
]; 