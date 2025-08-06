import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as StockActions from '../actions/stock.actions';
import { GetMultipleStockQuotesUseCase } from '../../../../../domain/use-cases/get-multiple-stock-quotes.use-case';

@Injectable()
export class StockEffects {
  private actions$ = inject(Actions);
  private getMultipleStockQuotesUseCase = inject(GetMultipleStockQuotesUseCase);
  
  loadStocks$ = createEffect(() => this.actions$.pipe(
    ofType(StockActions.loadStocks),
    mergeMap(() => this.getMultipleStockQuotesUseCase.execute({ symbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'] })
      .pipe(
        map(stocks => StockActions.loadStocksSuccess({ stocks })),
        catchError(error => of(StockActions.loadStocksFailure({ error: error.message })))
      ))
  ));
} 