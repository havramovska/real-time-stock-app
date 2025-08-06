import { Component, OnInit, inject } from '@angular/core';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { StockCardComponent } from '../../components/stock-card/stock-card.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToggleEvent, StockWithUIState } from '@real-time-stock-app/models';
import { StockNgRxService } from '../../../state/services/stock-ngrx.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockCardComponent, LoaderComponent, NgFor, AsyncPipe, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private stockNgRxService = inject(StockNgRxService);
  
  stocks$: Observable<StockWithUIState[]> = this.stockNgRxService.getStocksWithUIState();
  loading$: Observable<boolean> = this.stockNgRxService.getLoading();
  error$: Observable<string | null> = this.stockNgRxService.getError();

  ngOnInit(): void {
    this.stockNgRxService.loadStocks();
  }

  onToggleChange({ symbol, isActive }: ToggleEvent): void {
    this.stockNgRxService.toggleStockActive(symbol, isActive);
  }
} 