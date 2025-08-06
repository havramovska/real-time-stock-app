export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
  lastTradeTime: string;
  volume: number;
}

export interface StockWithUIState extends Stock {
  isActive: boolean;
} 