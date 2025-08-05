export interface StockData {
    symbol: string;
    name: string;
    currentPrice: number;
    priceChange: number;
    percentageChange: number;
    lastTradeTime: string;
    volume: number;
    isActive: boolean;
}