import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  effect,
  inject,
  signal,
} from '@angular/core';
import { GameResult, StoreService } from '../../store/store.service';
import { AsyncPipe, NgIf, UpperCasePipe } from '@angular/common';
import {
  ApiService,
  Person,
  ResponseData,
  Starship,
} from '../../api/api.service';
import { Subject, takeUntil } from 'rxjs';
import { GameType } from '../../components/select-type-battle/select-type-battle.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GameService } from './game.service';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    NgIf,
    CardComponent,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [ApiService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnDestroy {
  private _storeService = inject(StoreService);
  private _unsubscribe$: Subject<boolean> = new Subject<boolean>();
  private _gameService = inject(GameService);
  private _cdr = inject(ChangeDetectorRef);

  gameType!: GameType;
  player1Data: Person | Starship | null = null;
  player2Data: Person | Starship | null = null;
  player1Score!: number;
  player2Score!: number;
  loading: boolean = true;
  isError: boolean = false;
  whichPlayerWon = signal(GameResult.DRAW);
  GameResultEnum = GameResult;

  private apiObserver = {
    next: (
      data: [ResponseData<Person | Starship>, ResponseData<Person | Starship>]
    ) => {
      this._setFetchedData(this.gameType, data);
    },
    error: () => {
      this.loading = false;
      this.isError = true;
      this._gameService.openErrorSnackBar();
      this._cdr.detectChanges();
    },
    complete: () => {
      this.loading = false;
      this._cdr.detectChanges();
    },
  };

  constructor() {
    effect(() => {
      this.gameType = this._storeService.getGameType();
      this._unsubscribe$.next(true);
      this.loading = true;
      this.isError = false;
      this._cdr.detectChanges();
      this.player1Data = null;
      this.player2Data = null;

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
    this.loading = true;
    this._cdr.detectChanges();
    this.player1Data = null;
    this.player2Data = null;

    if (this.gameType === 'people') {
      this._getPersons();
    } else {
      this._getStarships();
    }
  }

  clearScore(): void {
    this._storeService.resetPlayersStats();
  }

  private _getPersons(): void {
    this._gameService
      .getPersons()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(this.apiObserver);
  }

  private _getStarships(): void {
    this._gameService
      .getStarships()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(this.apiObserver);
  }

  private _setFetchedData(
    type: GameType,
    data: [ResponseData<Starship | Person>, ResponseData<Starship | Person>]
  ): void {
    this.player1Data = data[0]?.result?.properties;
    this.player2Data = data[1]?.result?.properties;

    if (type === 'people') {
      this.whichPlayerWon.set(
        this._gameService.submitResult(
          (this.player1Data as Person).mass,
          (this.player2Data as Person).mass
        )
      );
      this._gameService.openSuccessSnackBar(this.whichPlayerWon());
      this._storeService.addPoint(this.whichPlayerWon());
    } else {
      this.whichPlayerWon.set(
        this._gameService.submitResult(
          (this.player1Data as Starship).crew,
          (this.player2Data as Starship).crew
        )
      );
      this._gameService.openSuccessSnackBar(this.whichPlayerWon());
      this._storeService.addPoint(this.whichPlayerWon());
    }
    this._clearAnimatation();
  }

  private _clearAnimatation(): void {
    const timer = setTimeout(() => {
      this.whichPlayerWon.set(GameResult.DRAW);
      clearTimeout(timer);
    }, 1000);
  }
}
