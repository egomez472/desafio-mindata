import { Routes } from '@angular/router';
import { heroesGuard } from './core/guards/heroes.guard';

export const routes: Routes = [
  {
    path: 'heroes',
    loadComponent: () => import('./components/heroes/heroes.component').then(c => c.HeroesComponent),
    canActivate: [heroesGuard]
  },
  {
    path: 'add-hero',
    loadComponent: () => import('./components/abm-hero/abm-hero.component').then(c => c.ABMHeroComponent)
  },
  {
    path: '**',
    redirectTo: 'heroes'
  }
];
