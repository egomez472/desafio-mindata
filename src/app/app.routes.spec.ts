import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router } from "@angular/router"
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from "./app.routes";
import { Location } from '@angular/common'

describe('AppRoutes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('should navigate to /heroes?page=1 and load HeroesComponent', fakeAsync(() => {
    router.navigate(['heroes']);
    tick();
    expect(location.path()).toBe('/heroes?page=1');
  }))

  it('should navigate to /abm-hero and load ABMHeroComponent', fakeAsync(() => {
    router.navigate(['abm-hero']);
    tick();
    expect(location.path()).toBe('/abm-hero');
  }))

  it('should redirect to /heroes?page=1 for unknown routes', fakeAsync(() => {
    router.navigate(['asd']);
    tick();
    expect(location.path()).toBe('/heroes?page=1');
  }))
})
