import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { StoreService } from '../../store/store.service';

export type GameType = 'people' | 'starships';

export interface GameSelect {
  value: GameType;
  viewValue: string;
}

@Component({
  selector: 'app-select-type-battle',
  standalone: true,
  imports: [MatSelectModule, FormsModule],
  templateUrl: './select-type-battle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTypeBattleComponent {
  private _storeService = inject(StoreService);
  selectedValue: GameType = this._storeService.getGameType();

  gameTypes: GameSelect[] = [
    { value: 'people', viewValue: 'People' },
    { value: 'starships', viewValue: 'Starships' },
  ];

  updateGameType(value: GameType): void {
    this._storeService.updateGameType(value);
  }
}
