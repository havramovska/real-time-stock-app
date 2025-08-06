export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
  lastTradeTime: string;
  dailyHigh: number;
  dailyLow: number;
  weekHigh52: number;
  weekLow52: number;
}

export interface StockWithUIState extends Stock {
  isActive: boolean;
} 