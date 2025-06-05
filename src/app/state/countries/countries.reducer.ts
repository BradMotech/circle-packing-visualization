import { createReducer, on } from '@ngrx/store';
import { loadCountriesSuccess, selectACountry } from './countries.actions';
import { WorldDataSet, CountryInterface } from 'src/app/core/models/country.model';

export interface CountriesState {
  countries: WorldDataSet;
  selectedCountry: CountryInterface | null;
}

export const initialState: CountriesState = {
  countries: {},
  selectedCountry: null
};

export const countriesReducer = createReducer(
  initialState,
  on(loadCountriesSuccess, (state, { countries }) => {
    return { ...state, countries };
  }),
  on(selectACountry, (state, { country }) => ({
    ...state,
    selectedCountry: country
  }))
);
