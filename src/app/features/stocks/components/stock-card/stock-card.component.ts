import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToggleButtonComponent } from '../toggle-button/toggle-button.component';
import { FormatPricePipe } from '../../../../shared/pipes/format-price.pipe';
import { FormatPriceChangePipe } from '../../../../shared/pipes/format-price-change.pipe';
import { FormatPercentagePipe } from '../../../../shared/pipes/format-percentage.pipe';
import { FormatVolumePipe } from '../../../../shared/pipes/format-volume.pipe';
import { PriceChangeClassPipe } from '../../../../shared/pipes/price-change-class.pipe';
import { CardClassPipe } from '../../../../shared/pipes/card-class.pipe';
import { StockData } from '../../models/stock-data.model';
import { ToggleEvent } from '../../models/toggle-event.model';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [
    ToggleButtonComponent,
    FormatPricePipe,
    FormatPriceChangePipe,
    FormatPercentagePipe,
    FormatVolumePipe,
    PriceChangeClassPipe,
    CardClassPipe
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
