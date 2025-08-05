import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPercentage',
  standalone: true
})
export class FormatPercentagePipe implements PipeTransform {
  transform(percentage: number): string {
    const sign = percentage > 0 ? '+' : '';
    return `(${sign}${percentage.toFixed(2)}%)`;
  }
} 