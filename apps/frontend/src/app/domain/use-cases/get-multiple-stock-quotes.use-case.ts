import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from './base.use-case';
import { StockRepository, STOCK_REPOSITORY } from '../repositories/stock.repository.interface';
import { StockQuote } from '../entities/stock.entity';

export interface GetMultipleStockQuotesRequest {
  symbols: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GetMultipleStockQuotesUseCase extends BaseUseCase<GetMultipleStockQuotesRequest, StockQuote[]> {
  constructor(@Inject(STOCK_REPOSITORY) private stockRepository: StockRepository) {
    super();
  }

  execute(request: GetMultipleStockQuotesRequest): Observable<StockQuote[]> {
    return this.stockRepository.getMultipleStockQuotes(request.symbols);
  }
} 