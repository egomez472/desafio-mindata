import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'heroes',
    loadComponent: () => import('./components/heroes/heroes.component').then(c => c.HeroesComponent)
  },
  {
    path: 'add-hero',
    loadComponent: () => import('./components/add-edit-hero/add-edit-hero.component').then(c => c.AddHeroComponent)
  },
  {
    path: '**',
    redirectTo: 'heroes'
  }
];
