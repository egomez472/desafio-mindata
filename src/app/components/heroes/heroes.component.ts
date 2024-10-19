import { Component, inject } from '@angular/core';
import { HeroesService } from '../../core/services/heroes.service';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent {

  private readonly heroesSvc = inject(HeroesService);

  heroImage: string | ArrayBuffer | null = null;

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
