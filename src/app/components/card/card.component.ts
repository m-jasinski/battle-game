import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Person, Starship } from '../../api/api.service';
import { GameType } from '../select-type-battle/select-type-battle.component';
import { GameResult } from '../../store/store.service';
import { CardContentComponent } from '../card-content/card-content.component';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardContentComponent, LoadingCardComponent, MatBadgeModule],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  type = input.required<GameType>();
  player = input.required<string>();
  playerData = input.required<Person | Starship | null>();
  playerScore = input.required<number>();
  loading = input.required<boolean>();
  shouldAnimate = input.required<boolean>();
}
