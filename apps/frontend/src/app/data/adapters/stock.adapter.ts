import { Injectable } from '@angular/core';
import { 
  Stock,
  StockWithUIState 
} from '@real-time-stock-app/models';
import { StockApiResponse } from '../sources/api/stock-api.interface';

@Injectable({
  providedIn: 'root'
})
export class StockAdapter {
  transformApiResponseToStock(
    apiResponse: StockApiResponse, 
    companyName?: string
  ): Stock {
    const timestamp = new Date(apiResponse.timestamp * 1000);
    
    return {
      symbol: apiResponse.symbol,
      name: companyName || apiResponse.symbol,
      currentPrice: apiResponse.currentPrice,
      priceChange: apiResponse.priceChange,
      percentageChange: apiResponse.percentageChange,
      lastTradeTime: timestamp.toISOString(),
      volume: apiResponse.volume || 0
    };
  }

  transformApiResponsesToStocks(
    apiResponses: StockApiResponse[], 
    companyNames?: Record<string, string>
  ): Stock[] {
    return apiResponses.map(response => 
      this.transformApiResponseToStock(response, companyNames?.[response.symbol])
    );
  }

  transformToStockWithUIState(stock: Stock, isActive: boolean = false): StockWithUIState {
    return {
      ...stock,
      isActive
    };
  }

  transformToStocksWithUIState(stocks: Stock[], isActive: boolean = false): StockWithUIState[] {
    return stocks.map(stock => this.transformToStockWithUIState(stock, isActive));
  }

  updateStockWithApiResponse(
    existingStock: StockWithUIState, 
    apiResponse: StockApiResponse
  ): StockWithUIState {
    const timestamp = new Date(apiResponse.timestamp * 1000);
    
    return {
      ...existingStock,
      currentPrice: apiResponse.currentPrice,
      priceChange: apiResponse.priceChange,
      percentageChange: apiResponse.percentageChange,
      lastTradeTime: timestamp.toISOString()
    };
  }
} 