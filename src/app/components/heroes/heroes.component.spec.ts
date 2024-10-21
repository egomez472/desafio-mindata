import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { HeroesService } from '../../core/services/heroes.service';
import { LoadingService } from '../../core/services/loading.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Component } from '@angular/core';
import { Hero } from '../../core/models/hero.model';

@Component({
  selector: 'app-hero-card',
  template: ''
})
class MockHeroCardComponent {}

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroesServiceMock: jasmine.SpyObj<HeroesService>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    heroesServiceMock = jasmine.createSpyObj('HeroesService', ['getHeroes']);
    (heroesServiceMock as any).heroesList = signal<Hero[]>([]);
    loadingServiceMock = jasmine.createSpyObj('LoadingService', ['isLoading']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HeroesComponent],
      declarations: [MockHeroCardComponent],
      providers: [
        { provide: HeroesService, useValue: heroesServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle page change', () => {
    const newPage = 2;
    component.onPageChange(newPage);

    expect(routerMock.navigate).toHaveBeenCalledWith(['heroes'], { queryParams: { page: newPage } });
    expect(component.page).toBe(newPage);
  });

  it('should show loading indicator when loading', () => {
    loadingServiceMock.isLoading.and.returnValue(true);
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.nativeElement.querySelector('.loading-box');
    expect(loadingElement).toBeTruthy();
  });

  it('should display no heroes message when heroes list is empty', () => {
    const mockHeroes: any[] = [];
    heroesServiceMock.getHeroes.and.returnValue(of(mockHeroes));

    component.ngOnInit();
    fixture.detectChanges();

    const noHeroesElement = fixture.debugElement.nativeElement.querySelector('.no-heroes-box');
    expect(noHeroesElement).toBeTruthy();
  });
});
