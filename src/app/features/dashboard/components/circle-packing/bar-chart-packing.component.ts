import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { renderBarChart } from './bar-chart-packing.d3';

@Component({
  selector: 'app-bar-chart-packing',
  template: `<div #container></div>`,
})
export class BarCartPackingComponent implements OnChanges {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  @Input() data: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.containerRef.nativeElement.innerHTML = '';

      const hierarchy = this.build3TierHierarchyFromWorldDataSet(this.data);

      renderBarChart({
        data: hierarchy,
        element: this.containerRef.nativeElement,
        onSelect: (country: any) => {
          console.log('Selected country:', country); // TODO: Remove console logs 
        },
      });
    }
  }

  build3TierHierarchyFromWorldDataSet(data: any): any {
    return {
      name: 'World',
      children: Object.entries(data).map(([regionName, subregions]) => ({
        name: regionName,
        children: Object.entries(subregions as any).map(([subregionName, countries]) => ({
          name: subregionName,
          children: (countries as any).map((country: any) => ({
            name: country.country,
            value: country.population,
            flag: country.flag,
            wikipedia: country.wikipediaUrl,
            data: country,
          })),
        })),
      })),
    };
  }
}
