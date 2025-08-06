export interface FinnhubQuoteResponse {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
  weekHigh52?: number;
  weekLow52?: number;
}

export interface FinnhubSymbol {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface FinnhubErrorResponse {
  error: string;
} 