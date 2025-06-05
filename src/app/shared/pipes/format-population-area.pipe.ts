import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPopulationOrArea',
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number, type: 'population' | 'area'): string {
    if (typeof value !== 'number') return '';

    if (type === 'population') {
      if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
      }
      if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (value >= 1_000) {
        return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
      }
      return value.toString();
    }

    if (type === 'area') {
      if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M km²';
      }
      if (value >= 1_000) {
        return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k km²';
      }
      return value + ' km²';
    }

    return value.toString();
  }
}
