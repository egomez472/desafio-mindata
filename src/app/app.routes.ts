import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'heroes',
    loadComponent: () => import('./components/heroes/heroes.component').then(c => c.HeroesComponent)
  },
  {
    path: 'add-hero',
    loadComponent: () => import('./components/add-hero/add-hero.component').then(c => c.AddHeroComponent)
  },
  {
    path: '**',
    redirectTo: 'heroes'
  }
];
