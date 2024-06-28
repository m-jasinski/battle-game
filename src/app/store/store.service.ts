import { Injectable, signal } from '@angular/core';
import { GameType } from '../components/select-type-battle/select-type-battle.component';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly _gameType = signal<GameType>('starships');
  private readonly _playerOneScore = signal(0);
  private readonly _playerTwoScore = signal(0);

  updateGameType(type: GameType): void {
    this._gameType.set(type);
  }

  getGameType(): GameType {
    return this._gameType();
  }

  getPlayer1Score(): number {
    return this._playerOneScore();
  }

  getPlayer2Score(): number {
    return this._playerTwoScore();
  }

  addPoint(player: 1 | 2): void {
    if (player === 1) {
      this._playerOneScore.update((prev) => ++prev);
    } else {
      this._playerTwoScore.update((prev) => ++prev);
    }
  }

  resetPleyrsStats(): void {
    this._playerOneScore.set(0);
    this._playerTwoScore.set(0);
  }
}
