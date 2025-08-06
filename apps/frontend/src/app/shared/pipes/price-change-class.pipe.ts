import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceChangeClass',
  standalone: true
})
export class PriceChangeClassPipe implements PipeTransform {
  transform(priceChange: number): string {
    if (priceChange > 0) return 'positive';
    if (priceChange < 0) return 'negative';
    return 'neutral';
  }
} 