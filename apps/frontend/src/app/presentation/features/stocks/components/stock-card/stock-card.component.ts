import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormatPricePipe } from '../../../../shared/pipes/format-price.pipe';
import { FormatPriceChangePipe } from '../../../../shared/pipes/format-price-change.pipe';
import { FormatPercentagePipe } from '../../../../shared/pipes/format-percentage.pipe';
import { PriceChangeClassPipe } from '../../../../shared/pipes/price-change-class.pipe';
import { CardClassPipe } from '../../../../shared/pipes/card-class.pipe';
import { FormatTradeTimePipe } from '../../../../shared/pipes/format-trade-time.pipe';
import { ToggleButtonComponent } from '../toggle-button/toggle-button.component';
import { StockWithUIState as StockData, ToggleEvent } from '@real-time-stock-app/models';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [
    ToggleButtonComponent,
    FormatPricePipe,
    FormatPriceChangePipe,
    FormatPercentagePipe,
    PriceChangeClassPipe,
    CardClassPipe,
    FormatTradeTimePipe
  ],
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss']
})
export class StockCardComponent {
  @Input() stock!: StockData;
  @Output() toggleChange = new EventEmitter<ToggleEvent>();

  onToggleChange(isActive: boolean): void {
    this.toggleChange.emit({ 
      symbol: this.stock.symbol, 
      isActive 
    });
  }
}
