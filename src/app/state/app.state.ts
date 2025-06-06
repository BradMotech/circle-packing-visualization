import { CountriesState } from "./countries/countries.reducer";

// Country app state, imports interface CountriesState containing {countries and selectedCountry}
/**
 * @interface CountriesState
 */
export interface AppState {
    countries: CountriesState
}