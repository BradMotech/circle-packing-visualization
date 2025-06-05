import { Component, OnInit } from '@angular/core';
import { CountryDataService } from './core/services/country-data.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'circle-packing-visualisation';

  constructor(private readonly dataService: CountryDataService) {}
  fullData: any = null; // storing full data when loaded/available
  filteredData: any = null; // Storing Data filtered by region when available
  sidebarCollapsed = false; // Sidebar collapsible flag;

  viewMode: 'bar' | 'pie' = 'pie'; // Options for the view mode, defaulted to pie chart showing countris enclosed

  ngOnInit() {
    this.dataService.getWorldRegion().subscribe((data) => {
      this.fullData = data;
      this.filteredData = data; // initialize filteredData with fullData
      console.log(data); // Left intentionally for debugging purposes TODO: Clean up console logs
    });
  }

  //  Toggle view mode between bar and pie chart showing countries by region
  toggleView(mode: 'bar' | 'pie') {
    this.viewMode = mode;
  }
  onSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
// Method called when region selection occurs, to re-load chart data for soecific region selected.
  onRegionChange(region: any) {
    if (!this.fullData) return; // no data loaded yet, so ignore and return

    if (region === 'All') {
      this.filteredData = this.fullData;
    } else {
      this.filteredData = {
        ...this.fullData,
        children: this.fullData.children.filter(
          (item: any) => item.region === region
        ),
      };
    }
  }
}
