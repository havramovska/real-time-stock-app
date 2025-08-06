export const STOCK_SYMBOLS = [
  'AAPL',
  'GOOGL',
  'MSFT',
  'TSLA'
] as const;

export type StockSymbol = typeof STOCK_SYMBOLS[number]; 