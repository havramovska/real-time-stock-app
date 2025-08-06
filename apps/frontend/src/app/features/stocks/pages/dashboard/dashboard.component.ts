import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { StockCardComponent } from '../../components/stock-card/stock-card.component';
import { StockWithUIState as StockData, ToggleEvent } from '@real-time-stock-app/models';
import { StockDataService } from '../../services/stock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockCardComponent, NgFor, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private stockDataService = inject(StockDataService);
  
  stocks$: Observable<StockData[]> = this.stockDataService.stocks$;

  ngOnInit(): void {
    this.stockDataService.initializeStocks();
    this.stockDataService.subscribeToLiveUpdates();
  }

  ngOnDestroy(): void {
    this.stockDataService.cleanup();
  }

  onToggleChange({ symbol, isActive }: ToggleEvent): void {
    this.stockDataService.updateStockActiveStatus(symbol, isActive);
  }
}
