import { createAction, props } from '@ngrx/store';
import { WorldDataSet, CountryInterface } from '../../core/models/country.model';

export const loadCountries = createAction('[Countries] Load all Countries');

export const loadCountriesSuccess = createAction(
  '[Countries] Load all Countries success',
  props<{ countries: WorldDataSet }>()
);

export const loadCountriesFailure = createAction(
  '[Countries] Load all Countries error',
  props<{ error: any }>()
);

export const selectACountry = createAction(
  '[Countries] Select a Country',
  props<{ country: CountryInterface }>()
);
