import { Routes } from '@angular/router';
import { GameComponent } from './page/game/game.component';
import { NotFoundComponent } from './page/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GameComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
