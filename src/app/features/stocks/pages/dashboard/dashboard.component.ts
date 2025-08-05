import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { StockCardComponent } from '../../components/stock-card/stock-card.component';
import { StockData } from '../../models/stock-data.model';
import { MOCK_STOCK_DATA } from '../../../../data/sources/mocks';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockCardComponent, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stocks: StockData[] = [];

  ngOnInit() {
    this.initializeStocks();
  }

  initializeStocks() {
    this.stocks = MOCK_STOCK_DATA;
  }

  onToggleChange(event: { symbol: string; isActive: boolean }) {
    const stock = this.stocks.find(s => s.symbol === event.symbol);
    if (stock) {
      stock.isActive = event.isActive;
    }
  }
}
