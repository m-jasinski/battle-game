import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  GameType,
  SelectTypeBattleComponent,
} from './components/select-type-battle/select-type-battle.component';
import { StoreService } from './store/store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SelectTypeBattleComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private _storeService = inject(StoreService);

  gameType: GameType = 'starships';
  classLogo: 'bg-ship' | 'bg-vader' = 'bg-ship';

  constructor() {
    effect(() => {
      this.gameType = this._storeService.getGameType();
      this.classLogo = this.gameType === 'people' ? 'bg-vader' : 'bg-ship';
    });
  }
}
