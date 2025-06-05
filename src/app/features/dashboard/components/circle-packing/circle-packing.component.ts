import { renderCirclePacking } from './circle-packing.d3';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-circle-packing',
  template: `<div #container></div>`,
})
export class CirclePackingComponent implements OnChanges {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;

  @Input() data: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      // Clearing existing SVG/chart
      this.containerRef.nativeElement.innerHTML = '';

      // Building country hierarchy from the passed-in data
      const hierarchy = this.build3TierHierarchyFromWorldDataSet(this.data);

      // Now rendering the circlePacking
      renderCirclePacking({
        data: hierarchy,
        element: this.containerRef.nativeElement,
        onSelect: (country) => {
          console.log('Selected country:', country);
        }
      });
    }
  }

  //  Because the data comes as a 3 layered hierachy,
  //  flattening it to show the world, countries per region in the d3 implememtation
  build3TierHierarchyFromWorldDataSet(data: any): any {
    if (!data || typeof data !== 'object') {
      console.warn('⚠ Invalid world data input:', data);
      return { name: 'World', children: [] };
    }

    return {
      name: 'World', // This is the parent hierachy, the world
      children: Object.entries(data).map(([regionName, subregions]) => ({ // The world's children, namely regions
        name: regionName, // The region names provided
        children: Object.entries(subregions as any).map( // The region names
          ([subregionName, countries]) => ({ // sub rehion layer
            name: subregionName, // sub region names
            children: (countries as any).map((country: any) => ({ // the sub region children, namely countries per region
              name: country.country,
              value: country.population,
              flag: country.flag,
              wikipedia: country.wikipediaUrl,
              data: country,
            })),
          })
        ),
      })),
    };
  }
}
