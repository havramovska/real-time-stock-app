import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { StockQuote } from '../../../../../domain/entities/stock.entity';
import * as StockActions from '../actions/stock.actions';

export interface StockState extends EntityState<StockQuote> {
  loading: boolean;
  error: string | null;
  selectedSymbols: string[];
  activeStocks: Set<string>;
}

export const stockAdapter: EntityAdapter<StockQuote> = createEntityAdapter<StockQuote>({
  selectId: (stock: StockQuote) => stock.symbol,
  sortComparer: (a: StockQuote, b: StockQuote) => a.symbol.localeCompare(b.symbol)
});

export const initialState: StockState = stockAdapter.getInitialState({
  loading: false,
  error: null,
  selectedSymbols: [],
  activeStocks: new Set(['AAPL', 'GOOGL', 'MSFT', 'TSLA'])
});

export const stockReducer = createReducer(
  initialState,
  
  on(StockActions.loadStocks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StockActions.loadStocksSuccess, (state, { stocks }) => ({
    ...stockAdapter.setAll(stocks, state),
    loading: false,
    error: null
  })),
  
  on(StockActions.loadStocksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(StockActions.updateStock, (state, { stock }) => {
    // Only update if stock is active
    if (state.activeStocks.has(stock.symbol)) {
      return stockAdapter.upsertOne(stock, state);
    }
    return state;
  }),
  
  on(StockActions.updateStocks, (state, { stocks }) => {
    // Only update active stocks
    const activeStocks = stocks.filter(stock => state.activeStocks.has(stock.symbol));
    return stockAdapter.upsertMany(activeStocks, state);
  }),
  
  on(StockActions.toggleStockActive, (state, { symbol, isActive }) => {
    const newActiveStocks = new Set(state.activeStocks);
    if (isActive) {
      newActiveStocks.add(symbol);
    } else {
      newActiveStocks.delete(symbol);
    }
    return {
      ...state,
      activeStocks: newActiveStocks
    };
  }),
  
  on(StockActions.setSelectedSymbols, (state, { symbols }) => ({
    ...state,
    selectedSymbols: symbols
  })),
  
    on(StockActions.clearError, (state) => ({
    ...state,
    error: null
  }))
); 