import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GameType } from '../select-type-battle/select-type-battle.component';
import { Person, Starship } from '../../api/api.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  type = input.required<GameType>();
  data = input.required<Person | Starship>();

  getDataAsStarship(): Starship {
    return this.data() as Starship;
  }

  getDataAsPerson(): Person {
    return this.data() as Person;
  }
}
