import { Component, inject, OnInit, signal } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeroesService } from '../../core/services/heroes.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { HeroModel } from '../../core/models/hero.model';
import { UppercaseInputDirective } from '../../shared/directives/uppercase-input.directive';
import { Router } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';

const DEFAULT_IMAGE = 'assets/img/hero-default.png'
const modules = [
  LoadingComponent,
  CommonModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatChipsModule,
  MatIconModule,
  MatButtonModule,
  UppercaseInputDirective
]

@Component({
  selector: 'app-add-hero',
  standalone: true,
  imports: modules,
  templateUrl: './add-edit-hero.component.html',
  styleUrl: './add-edit-hero.component.scss'
})
export class AddEditHeroComponent implements OnInit {

  private readonly announcer = inject(LiveAnnouncer);
  private readonly heroesSvc = inject(HeroesService);
  private readonly router = inject(Router);
  readonly loadingSvc = inject(LoadingService);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  addOnBlur: boolean = true;
  form!: FormGroup;
  heroImage: [string | ArrayBuffer | null, File | null] = [DEFAULT_IMAGE, null];

  fileName = signal('No file uploaded yet.');
  readonly powers = signal(['Agility', 'Super strength']);

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      alias: new FormControl(''),
      powers: new FormControl(this.powers()),
      team: new FormControl(''),
      img: new FormControl('')
    })
  }

  get nameControl() {
    return this.form.get('name');
  }

  get aliasControl() {
    return this.form.get('alias');
  }

  get powersControl() {
    return this.form.get('powers');
  }

  get teamControl() {
    return this.form.get('team');
  }

  get imgControl() {
    return this.form.get('img');
  }

  uploadImage(event: any) {
    let file = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);

    reader.onloadend = async () => {
      this.fileName.update(_ => file[0].name);
      this.heroImage = [reader.result, file[0]];
    }
  }

  async onSubmit(form: FormGroup) {
    if(form.valid) {
      this.loadingSvc.show();

      // Subo el archivo primero a firebase y luego lo seteo al form para enviar al servicio
      if(this.heroImage[0] !== DEFAULT_IMAGE) {
        let imgSrc = await this.heroesSvc.uploadHeroImage(`hero-image_${new Date().getTime()}`, this.heroImage[1]);
        this.imgControl?.setValue(imgSrc);
      }

      let hero = new HeroModel(
        this.nameControl?.value,
        this.aliasControl?.value,
        this.powersControl?.value,
        this.teamControl?.value,
        this.imgControl?.value
      );

      this.heroesSvc.addHero(hero).subscribe(
        (response) => {
          if(response.id) {
            this.router.navigate(['heroes'])
          }
        }
      );
    }
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.powers.update(powers => [...powers, value]);
    }

    event.chipInput!.clear();
  }

  remove(power: any): void {
    this.powers.update(_power => {
      const index = _power.indexOf(power);
      if (index < 0) {
        return _power;
      }

      _power.splice(index, 1);
      this.announcer.announce(`removed ${power}`);
      return [..._power];
    });
  }
}
