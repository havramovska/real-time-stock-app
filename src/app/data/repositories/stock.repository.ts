import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StockData } from '../../features/stocks/models/stock-data.model';
import { MOCK_STOCK_DATA } from '../sources/mocks';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StockRepository {
  getStocks(): Observable<StockData[]> {
    if (environment.useMockData) {
      return of(MOCK_STOCK_DATA);
    } else {
      console.warn('Real API not implemented yet, using mock data for now');
      return of(MOCK_STOCK_DATA);
    }
  }
}
