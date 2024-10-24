import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Hero } from '../../../core/models/hero.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss'
})
export class HeroCardComponent {
  @Input('hero') hero!: Hero;

  private readonly router = inject(Router)

  onEditHero(hero: Hero) {
    this.router.navigate(['abm-hero'], {queryParams: {edit: hero.id}})
  }
}
