export interface StockEntity {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  lastUpdated: Date;
  dailyHigh: number;
  dailyLow: number;
  weekHigh52: number;
  weekLow52: number;
}

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  lastUpdated: Date;
  dailyHigh: number;
  dailyLow: number;
  weekHigh52: number;
  weekLow52: number;
} 