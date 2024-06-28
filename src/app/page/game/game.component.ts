import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  effect,
  inject,
} from '@angular/core';
import { StoreService } from '../../store/store.service';
import { AsyncPipe, NgIf, UpperCasePipe } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import {
  ApiService,
  Person,
  ResponseData,
  Starship,
} from '../../api/api.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { GameType } from '../../components/select-type-battle/select-type-battle.component';
import { LoadingCardComponent } from '../../components/loading-card/loading-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { getPersonInitialData } from '../../data/person-data';
import { getStarshipInitialData } from '../../data/starship-data.';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    CardComponent,
    NgIf,
    LoadingCardComponent,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatSnackBarModule,
  ],
  providers: [ApiService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnDestroy {
  private _storeService = inject(StoreService);
  private _apiService = inject(ApiService);
  private _unsubscribe$: Subject<boolean> = new Subject<boolean>();
  private _snackBar = inject(MatSnackBar);
  private _cdr = inject(ChangeDetectorRef);

  gameType!: GameType;

  player1Data: Person | Starship | null = null;
  player2Data: Person | Starship | null = null;
  player1Score!: number;
  player2Score!: number;
  loading: boolean = true;
  whichPlayerWon: number = 0;

  constructor() {
    effect(() => {
      this.gameType = this._storeService.getGameType();
      this._unsubscribe$.next(true);
      if (this.gameType === 'people') {
        this._getPersons();
      } else {
        this._getStarships();
      }
    });
    effect(() => {
      this.player1Score = this._storeService.getPlayer1Score();
      this.player2Score = this._storeService.getPlayer2Score();
      this._cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next(true);
    this._unsubscribe$.unsubscribe();
  }

  fetchData(): void {
    if (this.gameType === 'people') {
      this._getPersons();
    } else {
      this._getStarships();
    }
  }

  clearScore(): void {
    this._storeService.resetPlayersStats();
  }

  private _openSnackBar(message: string, shouldStay: boolean = false) {
    this._snackBar.open(message, 'CLOSE', {
      duration: shouldStay ? 0 : 2000,
      verticalPosition: 'top',
    });
  }

  private _getPersons(): void {
    this.loading = true;
    this._cdr.detectChanges();
    forkJoin([
      this._apiService.getRandomPerson(),
      this._apiService.getRandomPerson(),
    ])
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: (data: [ResponseData<Person>, ResponseData<Person>]) => {
          this._setFetchedData(this.gameType, data);
        },
        error: (err) => this._setInitialState(),
        complete: () => this._cdr.detectChanges(),
      });
  }

  private _getStarships(): void {
    this.loading = true;
    this._cdr.detectChanges();
    forkJoin([
      this._apiService.getRandomStarship(),
      this._apiService.getRandomStarship(),
    ])
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: (data: [ResponseData<Starship>, ResponseData<Starship>]) => {
          this._setFetchedData(this.gameType, data);
        },
        error: (err) => {
          this._setInitialState();
        },
        complete: () => this._cdr.detectChanges(),
      });
  }

  private _setFetchedData(
    type: GameType,
    data: [ResponseData<Starship | Person>, ResponseData<Starship | Person>]
  ): void {
    this.loading = false;
    this.player1Data = data[0]?.result?.properties;
    this.player2Data = data[1]?.result?.properties;

    if (type === 'people') {
      this._submitResult(
        (this.player1Data as Person).mass,
        (this.player2Data as Person).mass
      );
    } else {
      this._submitResult(
        (this.player1Data as Starship).crew,
        (this.player2Data as Starship).crew
      );
    }
  }

  private _setInitialState(): void {
    this.loading = false;
    this.player1Data = this._initialValue(this.gameType);
    this.player2Data = this._initialValue(this.gameType);
    this._openSnackBar('ERROR getting data. Try again in a moment', true);
  }

  private _getValue(value: string): number {
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

  private async _submitResult(
    player1Value: string,
    player2Value: string
  ): Promise<void> {
    const value1 = this._getValue(player1Value);
    const value2 = this._getValue(player2Value);

    if (value1 > value2) {
      this.whichPlayerWon = 1;
      this._storeService.addPoint(1);
      this._openSnackBar('PLAYER 1 WON');
      await this._clearResult();
      return;
    } else if (value1 < value2) {
      this.whichPlayerWon = 2;
      this._storeService.addPoint(2);
      this._openSnackBar('PLAYER 2 WON');
      await this._clearResult();
      return;
    } else {
      this._openSnackBar('DRAW');
    }
  }

  private _clearResult(): void {
    let timer = setTimeout(() => {
      this.whichPlayerWon = 0;
      clearTimeout(timer);
      this._cdr.detectChanges();
    }, 1200);
  }

  private _initialValue(type: GameType): Person | Starship {
    if (type === 'people') {
      return getPersonInitialData();
    } else {
      return getStarshipInitialData();
    }
  }
}
