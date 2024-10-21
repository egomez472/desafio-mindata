import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { HeroesService } from '../../core/services/heroes.service';
import { HeroCardComponent } from '../../shared/components/hero-card/hero-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Hero, HeroModel } from '../../core/models/hero.model';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [HeroCardComponent, CommonModule, NgFor, NgxPaginationModule],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent implements OnInit {

  @Input() id!: string;
  @Input() maxSize!: number;
  @Output() pageChange!: EventEmitter<number>;
  @Output() pageBoundsCorrection!: EventEmitter<number>;

  private readonly heroesSvc = inject(HeroesService);
  private readonly router = inject(Router);

  heroesList = signal<Hero[]>([]);
  p = signal(1);
  itemsPerPage = 5;

  // Función para hacer el trackBy por id
  trackById(index: number, hero: any): number {
    return hero.id;
  }

  paginatedHeroes = computed(() => {
    const startIndex = (this.p() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.heroesList().slice(startIndex, endIndex);
  });

  onPageChange(newPage: number) {
    this.p.set(newPage);
  }

  ngOnInit(): void {
    this.heroesSvc.getHeroes().subscribe((data) => {
      this.heroesList.set(data);// Actualizo la signal con los héroes recibidos
    });
  }

  navigate(url:string) {
    this.router.navigate([url])
  }
}
