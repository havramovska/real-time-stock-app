import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from './base.use-case';
import { StockRepository, STOCK_REPOSITORY } from '../repositories/stock.repository.interface';
import { StockQuote } from '../entities/stock.entity';

export interface GetStockQuoteRequest {
  symbol: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetStockQuoteUseCase extends BaseUseCase<GetStockQuoteRequest, StockQuote> {
  constructor(@Inject(STOCK_REPOSITORY) private stockRepository: StockRepository) {
    super();
  }

  execute(request: GetStockQuoteRequest): Observable<StockQuote> {
    return this.stockRepository.getStockQuote(request.symbol);
  }
} 