import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { API_PROVIDERS } from './data/sources/api/api-providers.config';
import { STOCK_REPOSITORY } from './domain/repositories/stock.repository.interface';
import { StockRepository } from './data/repositories/stock.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    ...API_PROVIDERS,
    {
      provide: STOCK_REPOSITORY,
      useClass: StockRepository
    }
  ]
};
