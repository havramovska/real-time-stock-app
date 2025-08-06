import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { API_PROVIDERS } from './data/sources/api/api-providers.config';
import { STOCK_REPOSITORY } from './domain/repositories/stock.repository.interface';
import { StockRepository } from './data/repositories/stock.repository';
import { stockReducer } from './presentation/features/state/store/reducers/stock.reducer';
import { StockEffects } from './presentation/features/state/store/effects/stock.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
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
    }),
    ...API_PROVIDERS,
    {
      provide: STOCK_REPOSITORY,
      useClass: StockRepository
    }
  ]
};
