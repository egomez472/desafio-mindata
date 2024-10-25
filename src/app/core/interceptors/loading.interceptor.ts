import { HttpInterceptorFn } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LoadingService } from '../services/loading.service';
import { delay } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingSvc = inject(LoadingService);
  loadingSvc.show();
  return next(req)
    .pipe(
      // isDevMode() ? delay(500) : delay(0), // Solo aplicar delay en dev mode
      finalize(() => {
        loadingSvc.hide()
      })
    );
};
