import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LoadingService } from '../services/loading.service';
import { delay } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingSvc = inject(LoadingService);
  loadingSvc.show()

  return next(req)
    .pipe(
      delay(500), //delay de 500ms para simular una peticion un poco mas prolongada y apreciar el loading
      finalize(() => {
        loadingSvc.hide()
      })
    );
};
