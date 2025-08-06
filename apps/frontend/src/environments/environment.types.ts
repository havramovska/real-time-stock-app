export interface Environment {
  production: boolean;
  useMockData: boolean;
  apiUrl: string;
  websocketUrl: string;
  updateInterval: number;
  finnhubApiKey: string;
  finnhubBaseUrl: string;
} 