import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CountryDataService } from '../../core/services/country-data.services';
import { loadCountries, loadCountriesFailure, loadCountriesSuccess } from './countries.actions';
import { switchMap, map, tap, catchError, of } from 'rxjs';
import { WorldDataSet } from 'src/app/core/models/country.model';

@Injectable()
export class CountriesEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly dataService: CountryDataService
  ) {}

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCountries),
      switchMap(() =>
        this.dataService.getWorldRegion().pipe(
          tap((data) => console.log('📦 Loaded from JSON mimicking api call:', data)),
          map((regionList: WorldDataSet) => {
            return loadCountriesSuccess({ countries: regionList });
          }),
          catchError((error) => {
            console.error('❌ Error loading world data. Please refresh the page', error);
            return of(loadCountriesFailure({ error }));
          })
        )
      )
    )
  );
}

