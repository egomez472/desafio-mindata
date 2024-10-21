import { Component, inject, OnInit, signal } from '@angular/core';
import { HeroesService } from '../../core/services/heroes.service';
import { HeroCardComponent } from '../../shared/components/hero-card/hero-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Hero, HeroModel } from '../../core/models/hero.model';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [HeroCardComponent, CommonModule, NgFor],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent implements OnInit {

  private readonly heroesSvc = inject(HeroesService);
  private readonly router = inject(Router);

  heroesList = signal<Hero[]>([]);

  ngOnInit(): void {
    this.heroesSvc.getHeroes().subscribe((data) => {
      this.heroesList.set(data);// Actualizo la signal con los héroes recibidos
    });
  }

  navigate(url:string) {
    this.router.navigate([url])
  }
}
