import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { heroesGuard } from './heroes.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { routes } from '../../app.routes';

describe('heroesGuard', () => {
  let router: Router;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: Router, useValue: routerMock }
      ]
    });

    router = TestBed.inject(Router);
    route = {} as ActivatedRouteSnapshot;
    state = { url: '/heroes' } as RouterStateSnapshot;
  });

  it('should redirect to "/heroes" with queryParams { page: 1 } if there is no page in queryParams', () => {
    route.queryParams = {};

    const result = TestBed.runInInjectionContext(() => heroesGuard(route, state));

    expect(router.navigate).toHaveBeenCalledWith(['/heroes'], { queryParams: { page: 1 } });
    expect(result).toBeFalse();
  });

  it('should allow navigation if there is a page in queryParams', () => {
    route.queryParams = { page: 2 };

    const result = TestBed.runInInjectionContext(() => heroesGuard(route, state));

    expect(router.navigate).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should allow navigation if the URL is not "/heroes"', () => {
    state.url = '/otra-ruta';

    route.queryParams = {};

    const result = TestBed.runInInjectionContext(() => heroesGuard(route, state));

    expect(router.navigate).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });
});
