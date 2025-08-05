import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPriceChange',
  standalone: true
})
export class FormatPriceChangePipe implements PipeTransform {
  transform(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}$${change.toFixed(2)}`;
  }
} 