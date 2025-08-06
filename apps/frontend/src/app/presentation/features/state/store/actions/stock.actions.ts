import { createAction, props } from '@ngrx/store';
import { StockQuote } from '../../../../../domain/entities/stock.entity';

export const loadStocks = createAction('[Stock] Load Stocks');
export const loadStocksSuccess = createAction(
  '[Stock] Load Stocks Success',
  props<{ stocks: StockQuote[] }>()
);
export const loadStocksFailure = createAction(
  '[Stock] Load Stocks Failure',
  props<{ error: string }>()
);

export const updateStock = createAction(
  '[Stock] Update Stock',
  props<{ stock: StockQuote }>()
);
export const updateStocks = createAction(
  '[Stock] Update Stocks',
  props<{ stocks: StockQuote[] }>()
);

export const toggleStockActive = createAction(
  '[Stock] Toggle Stock Active',
  props<{ symbol: string; isActive: boolean }>()
);

export const setSelectedSymbols = createAction(
  '[Stock] Set Selected Symbols',
  props<{ symbols: string[] }>()
);

export const clearError = createAction('[Stock] Clear Error'); 