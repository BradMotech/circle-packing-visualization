import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WorldDataSet } from '../models/country.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CountryDataService {
  constructor(private readonly http: HttpClient) {}

  getWorldRegion(): Observable<WorldDataSet> {
    return this.http
      .get<WorldDataSet>('/assets/world-data.json')
      .pipe(tap((data) => console.log('wprld data : ', data)));
  }
}
