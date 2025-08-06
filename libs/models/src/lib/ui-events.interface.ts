export interface ToggleEvent {
  symbol: string;
  isActive: boolean;
}

export interface LiveUpdatesState {
  enabled: boolean;
  activeStocks: string[];
} 