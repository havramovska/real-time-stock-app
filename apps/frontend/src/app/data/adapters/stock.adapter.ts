import { Stock } from '@real-time-stock-app/models';
import { StockWithUIState as StockData } from '@real-time-stock-app/models';

export function toStockData(stock: Stock): StockData {
  return {
    ...stock,
    isActive: true
  };
}
