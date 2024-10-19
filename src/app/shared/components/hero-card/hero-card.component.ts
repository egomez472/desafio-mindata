import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { HeroModel } from '../../../core/models/hero.model';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss'
})
export class HeroCardComponent {
  @Input('hero') hero!: HeroModel;
}
