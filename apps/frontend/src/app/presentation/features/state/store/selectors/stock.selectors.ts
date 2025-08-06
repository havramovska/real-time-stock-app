import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StockState, stockAdapter } from '../reducers/stock.reducer';
import { StockWithUIState } from '@real-time-stock-app/models';

export const selectStockState = createFeatureSelector<StockState>('stocks');

export const {
  selectAll: selectAllStocks,
  selectEntities: selectStockEntities,
  selectIds: selectStockIds,
  selectTotal: selectTotalStocks
} = stockAdapter.getSelectors(selectStockState);

export const selectLoading = createSelector(
  selectStockState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectStockState,
  (state) => state.error
);

export const selectSelectedSymbols = createSelector(
  selectStockState,
  (state) => state.selectedSymbols
);

export const selectActiveStocks = createSelector(
  selectStockState,
  (state) => state.activeStocks
);

export const selectActiveStockSymbols = createSelector(
  selectActiveStocks,
  (activeStocks) => Array.from(activeStocks)
);

export const selectActiveStocksData = createSelector(
  selectAllStocks,
  selectActiveStocks,
  (stocks, activeStocks) => stocks.filter(stock => activeStocks.has(stock.symbol))
);

export const selectStockBySymbol = (symbol: string) => createSelector(
  selectStockEntities,
  (entities) => entities[symbol]
);

export const selectIsStockActive = (symbol: string) => createSelector(
  selectActiveStocks,
  (activeStocks) => activeStocks.has(symbol)
);

export const selectStocksWithUIState = createSelector(
  selectAllStocks,
  selectActiveStocks,
  (stocks, activeStocks) => stocks.map(stock => ({
    ...stock,
    name: stock.symbol,
    currentPrice: stock.currentPrice,
    priceChange: stock.change,
    percentageChange: stock.changePercent,
    lastTradeTime: stock.lastUpdated.toISOString(),
    dailyHigh: stock.dailyHigh,
    dailyLow: stock.dailyLow,
    weekHigh52: stock.weekHigh52,
    weekLow52: stock.weekLow52,
    isActive: activeStocks.has(stock.symbol)
  } as StockWithUIState))
);

export const selectHasError = createSelector(
  selectError,
  (error) => error !== null
);

export const selectIsLoading = createSelector(
  selectLoading,
  (loading) => loading
); 