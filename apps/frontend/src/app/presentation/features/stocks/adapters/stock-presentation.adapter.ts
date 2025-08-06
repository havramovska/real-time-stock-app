import { Injectable } from '@angular/core';
import { StockQuote } from '../../../../domain/entities/stock.entity';
import { StockWithUIState } from '@real-time-stock-app/models';

@Injectable({
  providedIn: 'root'
})
export class StockPresentationAdapter {
  transformToUIState(stock: StockQuote): StockWithUIState {
    return {
      symbol: stock.symbol,
      name: `${stock.symbol} Stock`,
      currentPrice: stock.currentPrice,
      priceChange: stock.change,
      percentageChange: stock.changePercent,
      lastTradeTime: stock.lastUpdated.toISOString(),
      volume: stock.volume,
      isActive: true
    };
  }

  transformToUIStateList(stocks: StockQuote[]): StockWithUIState[] {
    return stocks.map(stock => this.transformToUIState(stock));
  }
} 