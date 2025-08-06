import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { stockReducer } from './reducers/stock.reducer';
import { StockEffects } from './effects/stock.effects';

export const storeConfig = [
  provideStore({
    stocks: stockReducer
  }),
  provideEffects([StockEffects]),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: false,
    autoPause: true,
    trace: false,
    traceLimit: 75
  })
]; 