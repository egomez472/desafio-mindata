import { Component, inject, OnInit, signal } from '@angular/core';
import { HeroesService } from '../../core/services/heroes.service';
import { HeroCardComponent } from '../../shared/components/hero-card/hero-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeroModel } from '../../core/models/hero.model';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [HeroCardComponent, CommonModule, NgFor],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent implements OnInit {

  private readonly heroesSvc = inject(HeroesService);

  heroImage: string | ArrayBuffer | null = null;

  heroesList = signal<HeroModel[]>([]);

  ngOnInit(): void {
    this.heroesSvc.getHeroes().subscribe((data) => {
      this.heroesList.set(data);// Actualizo la signal con los héroes recibidos
    });
  }


  uploadImage(event: any) {
    let file = event.target.files;
    let reader = new FileReader();

    reader.readAsDataURL(file[0]);
    reader.onloadend = async () => {
      let response = await this.heroesSvc.uploadHeroImage(`hero-image_${new Date().getTime()}`, file[0]);
      console.log(response);

      this.heroImage = response;
    }
  }
}
