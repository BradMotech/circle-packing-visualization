import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CountriesState } from "./countries.reducer";

export const selectCountriesState = createFeatureSelector<CountriesState>('countries');
// selector to use when selecting a country in the region circle, to display country data on the sidebar
export const selectAllCountries = createSelector(
  selectCountriesState,
  (state) => {
    return state.countries;
  }
);

export const selectSelectedCountry = createSelector(
  selectCountriesState,
  (state) => state.selectedCountry
);


