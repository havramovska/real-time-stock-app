import { Injectable } from '@angular/core';
import { StockQuote } from '../../domain/entities/stock.entity';
import { StockApiResponse } from '../sources/api/stock-api.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiToDomainMapper {
  mapQuoteToDomain(apiQuote: StockApiResponse, symbol: string): StockQuote {
    return {
      symbol,
      currentPrice: apiQuote.currentPrice,
      change: apiQuote.priceChange,
      changePercent: apiQuote.percentageChange,
      previousClose: apiQuote.currentPrice - apiQuote.priceChange,
      open: apiQuote.currentPrice,
      high: apiQuote.currentPrice,
      low: apiQuote.currentPrice,
      lastUpdated: new Date(apiQuote.timestamp)
    };
  }
} 