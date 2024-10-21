import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { heroesGuard } from './heroes.guard';

describe('heroesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => heroesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
