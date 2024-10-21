import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { HeroesService } from '../../core/services/heroes.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly heroesSvc = inject(HeroesService);

  searchControl = new FormControl('')

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(0)).subscribe(
      (alias) => {
        this.heroesSvc.getHeroesByAlias(alias ? alias : '')
      }
    )
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

}
