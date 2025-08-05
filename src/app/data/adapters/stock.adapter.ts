import { Stock } from '../../core/models/stock.entity';
import { StockData } from '../../features/stocks/models/stock-data.model';

export function toStockData(stock: Stock): StockData {
  return {
    ...stock,
    isActive: true
  };
}
