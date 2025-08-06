import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StockWithUIState as StockData } from '@real-time-stock-app/models';
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
