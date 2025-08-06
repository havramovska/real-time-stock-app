import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTradeTime',
  standalone: true
})
export class FormatTradeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }

      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1440) {
        if (diffInMinutes < 1) {
          return 'Just now';
        } else if (diffInMinutes < 60) {
          return `${diffInMinutes}m ago`;
        } else {
          const hours = Math.floor(diffInMinutes / 60);
          return `${hours}h ago`;
        }
      }

      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(',', '');
    } catch (error) {
      return 'Invalid time';
    }
  }
} 