import { Component, inject, Input, OnInit } from '@angular/core';
import { HeroesService } from '../../core/services/heroes.service';
import { HeroCardComponent } from '../../shared/components/hero-card/hero-card.component';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingService } from '../../core/services/loading.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [HeroCardComponent, CommonModule, NgFor, NgxPaginationModule, LoadingComponent],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent implements OnInit {

  @Input('page') page: any = 1;

  private readonly router = inject(Router);
  readonly loadingSvc = inject(LoadingService)
  readonly heroesSvc = inject(HeroesService);

  heroesList = this.heroesSvc.heroesList;

  ngOnInit(): void {
    this.heroesSvc.getHeroes()?.subscribe((data) => {
      if(this.heroesSvc.heroesList !== undefined && this.heroesSvc.originalHeroesList !== undefined) {
        this.heroesSvc.heroesList.set(data)// Actualizo la signal con los héroes recibidos
        this.heroesSvc.originalHeroesList.set(data);
      }
    });
  }

  //#region ngx-pagination functions
  trackById(hero: any): number {
    if(hero) {
      return hero.id;
    } else {
      return 0
    }
  }

  onPageChange(newPage: number) {
    this.router.navigate(['heroes'], {queryParams: {page: newPage}})
    this.page = newPage
  }
  //#endregion ngx-pagination functions

  navigate(url:string) {
    this.router.navigate([url])
  }
}
