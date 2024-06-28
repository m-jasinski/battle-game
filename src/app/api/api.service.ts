import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, timeout } from 'rxjs';

export interface ResponseData<T extends Person | Starship> {
  result: {
    properties: T;
  };
}

export interface Person {
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  name: string;
}

export interface Starship {
  consumables: string;
  cost_in_credits: string;
  crew: string;
  hyperdrive_rating: string;
  length: string;
  model: string;
  passengers: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly _httpClient = inject(HttpClient);
  private maxRetries = 3;
  private retriesCount = 0;

  getRandomPerson(): Observable<ResponseData<Person>> {
    const HOW_MANY_PERSONS = 80;
    const randomNumber = Math.floor(Math.random() * HOW_MANY_PERSONS) + 1;

    return this._httpClient
      .get<ResponseData<Person>>(
        `https://www.swapi.tech/api/people/${randomNumber}`
      )
      .pipe(
        timeout(2000),
        catchError((err) => {
          if (err.name === 'TimeoutError' || err.status === 404) {
            if (this.retriesCount < this.maxRetries) {
              ++this.retriesCount;
              return this.getRandomPerson();
            } else {
              this.retriesCount = 0;
              return throwError(() => err);
            }
          } else {
            return throwError(() => err);
          }
        })
      );
  }

  getRandomStarship(): Observable<ResponseData<Starship>> {
    const HOW_MANY_STARSHIPS = 14;
    const randomNumber = Math.floor(Math.random() * HOW_MANY_STARSHIPS) + 1;

    return this._httpClient
      .get<ResponseData<Starship>>(
        `https://www.swapi.tech/api/starships/${randomNumber}`
      )
      .pipe(
        timeout(2000),
        catchError((err) => {
          if (err.name === 'TimeoutError' || err.status === 404) {
            if (this.retriesCount < this.maxRetries) {
              ++this.retriesCount;
              return this.getRandomStarship();
            } else {
              this.retriesCount = 0;
              return throwError(() => err);
            }
          } else {
            this.retriesCount = 0;
            return throwError(() => err);
          }
        })
      );
  }
}
