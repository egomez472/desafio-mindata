import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { NavigationEnd, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeroesService } from '../../core/services/heroes.service';
import { of, Subject } from 'rxjs';

class MockRouter {
  events = of(); // Simulamos los eventos del router
  url = '';
  navigate(url: string[], options?: any) {
    this.url = url.join('/');
    return Promise.resolve(true);
  }
}

class MockHeroesService {
  getHeroesByAlias(alias: string) {
    return of([]); // Simulamos el retorno de héroes
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter: MockRouter;
  let mockHeroesService: MockHeroesService;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockHeroesService = new MockHeroesService();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: HeroesService, useValue: mockHeroesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct URL with query params', async () => {
    await component.navigate('heroes', 2);
    console.log(mockRouter.url);

    expect(mockRouter.url).toBe('heroes?page=2');
  });

  it('should navigate to the correct URL without query params', async () => {
    await component.navigate('abm-hero');
    expect(mockRouter.url).toBe('abm-hero');
  });

  it('should set routePath on router event', () => {
    const eventsSubject = new Subject<any>();
    (mockRouter.events as any)= eventsSubject.asObservable();

    mockRouter.url = '/heroes';
    component.ngOnInit();

    eventsSubject.next(new NavigationEnd(0, '/heroes', 'heroes'));
    expect(component.routePath).toBe('/heroes');
  });

  it('should call getHeroesByAlias on searchControl value changes', async () => {
    spyOn(mockHeroesService, 'getHeroesByAlias').and.callThrough();
    await component.ngOnInit();
    component.searchControl.setValue('Spiderman');
    expect(mockHeroesService.getHeroesByAlias).toHaveBeenCalledWith('Spiderman');
  });

  it('should return true from acceptContent if routePath includes /heroes', () => {
    component.routePath = '/heroes';
    expect(component.acceptContent()).toBeTrue();
  });

  it('should return false from acceptContent if routePath does not include /heroes', () => {
    component.routePath = '/other-route';
    expect(component.acceptContent()).toBeFalse();
  });

  it('should subscribe to searchControl value changes on init', (done) => {
    spyOn(mockHeroesService, 'getHeroesByAlias').and.callThrough();
    component.ngOnInit();
    component.searchControl.setValue('Spiderman');
    expect(mockHeroesService.getHeroesByAlias).toHaveBeenCalledWith('Spiderman');
    done();
  });
});
