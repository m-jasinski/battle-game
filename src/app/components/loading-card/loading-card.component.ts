import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-card',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingCardComponent {}
