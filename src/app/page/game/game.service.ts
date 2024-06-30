import { Injectable, inject } from '@angular/core';
import {
  ApiService,
  Person,
  ResponseData,
  Starship,
} from '../../api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin } from 'rxjs';
import { GameResult } from '../../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _apiService = inject(ApiService);
  private _snackBar = inject(MatSnackBar);

  private _openSnackBar(message: string, shouldStay: boolean = false): void {
    this._snackBar.open(message, 'CLOSE', {
      duration: shouldStay ? 0 : 2000,
      verticalPosition: 'top',
    });
  }

  openSuccessSnackBar(result: GameResult): void {
    switch (result) {
      case GameResult.DRAW: {
        this._openSnackBar('DRAW');
        break;
      }
      case GameResult.PLAYER1: {
        this._openSnackBar('PLAYER 1 WON');
        break;
      }
      case GameResult.PLAYER2: {
        this._openSnackBar('PLAYER 2 WON');
        break;
      }
    }
  }

  openErrorSnackBar(): void {
    this._openSnackBar('ERROR getting data. Try again in a moment', true);
  }

  getValueAsNumber(value: string): number {
    if (!Number.isNaN(Number(value))) {
      return Number(value);
    }
    if (value === 'unknown') {
      return 0;
    }
    if (value.includes(',')) {
      return Number(value.replace(',', ''));
    }
    if (value.includes('-')) {
      return Number(value.split('-')[1]);
    }
    return 0;
  }

  submitResult(player1Value: string, player2Value: string): GameResult {
    const value1: number = this.getValueAsNumber(player1Value);
    const value2: number = this.getValueAsNumber(player2Value);

    if (value1 > value2) {
      return GameResult.PLAYER1;
    } else if (value1 < value2) {
      return GameResult.PLAYER2;
    } else {
      return GameResult.DRAW;
    }
  }

  getPersons(): Observable<[ResponseData<Person>, ResponseData<Person>]> {
    return forkJoin([
      this._apiService.getRandomPerson(),
      this._apiService.getRandomPerson(),
    ]);
  }

  getStarships(): Observable<[ResponseData<Starship>, ResponseData<Starship>]> {
    return forkJoin([
      this._apiService.getRandomStarship(),
      this._apiService.getRandomStarship(),
    ]);
  }
}
