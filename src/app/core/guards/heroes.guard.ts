import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const heroesGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const queryParams = route.queryParams;

  if (state.url == '/heroes' && !queryParams['page']) {
    router.navigate(['/heroes'], { queryParams: { page: 1 } });
    return false;
  }

  return true;
};
