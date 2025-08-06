import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatVolume',
  standalone: true
})
export class FormatVolumePipe implements PipeTransform {
  transform(volume: number): string {
    return volume.toLocaleString();
  }
} 