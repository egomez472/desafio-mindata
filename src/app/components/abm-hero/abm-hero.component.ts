import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
import { Hero, HeroModel } from '../../core/models/hero.model';
import { UppercaseInputDirective } from '../../shared/directives/uppercase-input.directive';
import { Router } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

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
  selector: 'app-abm-hero',
  standalone: true,
  imports: modules,
  templateUrl: './abm-hero.component.html',
  styleUrl: './abm-hero.component.scss'
})
export class ABMHeroComponent implements OnInit {
  @Input('edit') edit: string = '';
  @Input('action') action!: string;

  private readonly announcer = inject(LiveAnnouncer);
  private readonly heroesSvc = inject(HeroesService);
  private readonly router = inject(Router);
  readonly loadingSvc = inject(LoadingService);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly powers = signal(['Agility', 'Super strength']);

  title: string = 'Add hero'
  addOnBlur: boolean = true;
  form!: FormGroup;
  heroImage: any[] = [DEFAULT_IMAGE, null];

  fileName = signal('No file uploaded yet.');

  ngOnInit(): void {
    if (Boolean(this.edit)) {
      this.title = 'Edit hero'
      this.heroesSvc.getHero(this.edit).subscribe(hero => {
        console.log(hero);
        this.idControl?.setValue(hero.id);
        this.nameControl?.setValue(hero.name);
        this.aliasControl?.setValue(hero.alias);
        this.powersControl?.setValue(hero.powers);
        this.powers.set(hero.powers);
        this.teamControl?.setValue(hero.team);
        this.imgControl?.setValue(hero.img);
        this.heroImage = [hero.img, null]
      })
    }


    this.form = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      alias: new FormControl(''),
      powers: new FormControl(this.powers()),
      team: new FormControl(''),
      img: new FormControl('')
    })
  }

  get idControl() {
    return this.form.get('id');
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
    if (form.valid) {
      // this.loadingSvc.show();
      if (Boolean(this.edit)) {
        this.editHero(form.value);
      } else {
        this.addHero();
      }

    }
  }

  async editHero(hero: Hero) {
    this.loadingSvc.show();
    if (hero.img !== this.heroImage[0]) {
      await this.uploadImg();
    }
    this.heroesSvc.editHero(this.form.value).subscribe(
      response => {
        if (response.id) {
          this.router.navigate(['heroes'])
        } else {
          throw new Error('Ocurrio un error al editar el heroe')
        }
      }
    )
  }

  async uploadImg() {
    let imgSrc = await this.heroesSvc.uploadHeroImage(`hero-image_${new Date().getTime()}`, this.heroImage[1]);
    this.imgControl?.setValue(imgSrc);
  }

  async addHero() {
    this.loadingSvc.show();

    // Subo el archivo primero a firebase y luego lo seteo al form para enviar al servicio
    if (this.heroImage[0] !== DEFAULT_IMAGE) {
      await this.uploadImg()
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
        if (response.id) {
          this.router.navigate(['heroes'])
        }
      }
    );
  }

  deleteHero() {
    // this.heroesSvc.de
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
