import { Injectable, signal } from '@angular/core';
import { GameType } from '../components/select-type-battle/select-type-battle.component';

export enum GameResult {
  'DRAW' = '0',
  'PLAYER1' = '1',
  'PLAYER2' = '2',
}

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

  addPoint(player: GameResult): void {
    if (player === GameResult.PLAYER1) {
      this._playerOneScore.update((prev) => ++prev);
    }
    if (player === GameResult.PLAYER2) {
      this._playerTwoScore.update((prev) => ++prev);
    }
  }

  resetPlayersStats(): void {
    this._playerOneScore.set(0);
    this._playerTwoScore.set(0);
  }
}
