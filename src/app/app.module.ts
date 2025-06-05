import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CirclePackingComponent } from './features/dashboard/components/circle-packing/circle-packing.component';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { countriesReducer } from './state/countries/countries.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CountriesEffects } from './state/countries/countries.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BarCartPackingComponent } from './features/dashboard/components/circle-packing/bar-chart-packing.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FormatNumberPipe } from './shared/pipes/format-population-area.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CirclePackingComponent,
    BarCartPackingComponent,
    HeaderComponent,
    FormatNumberPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({countries: countriesReducer}),
    EffectsModule.forRoot([CountriesEffects]),
  ],
  providers: [
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      // connectInZone: true // If set to true, the connection is established within the Angular zone
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
