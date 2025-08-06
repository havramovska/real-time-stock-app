import { Pipe, PipeTransform } from '@angular/core';
import { StockWithUIState } from '@real-time-stock-app/models';

@Pipe({
  name: 'cardClass',
  standalone: true,
  pure: false
})
export class CardClassPipe implements PipeTransform {
  transform(stock: StockWithUIState): string {
    if (!stock.isActive) return 'inactive';
    
    if (stock.priceChange > 0) return 'positive';
    if (stock.priceChange < 0) return 'negative';
    return 'neutral';
  }
} 