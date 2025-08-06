import { Injectable } from '@angular/core';
import { StockQuote } from '../../../../domain/entities/stock.entity';
import { StockWithUIState } from '@real-time-stock-app/models';

@Injectable({
  providedIn: 'root'
})
export class StockPresentationAdapter {
  transformToUIState(stock: StockQuote, activeStocks: Set<string>): StockWithUIState {
    return {
      symbol: stock.symbol,
      name: `${stock.symbol} Stock`,
      currentPrice: stock.currentPrice,
      priceChange: stock.change,
      percentageChange: stock.changePercent,
      lastTradeTime: stock.lastUpdated.toISOString(),
      dailyHigh: stock.dailyHigh || 0,
      dailyLow: stock.dailyLow || 0,
      weekHigh52: stock.weekHigh52 || 0,
      weekLow52: stock.weekLow52 || 0,
      isActive: activeStocks.has(stock.symbol)
    };
  }

  transformToUIStateList(stocks: StockQuote[], activeStocks: Set<string>): StockWithUIState[] {
    return stocks.map(stock => this.transformToUIState(stock, activeStocks));
  }
} 