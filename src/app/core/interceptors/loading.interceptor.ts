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
      delay(1000), //delay de 1s para simular una peticion un poco mas prolongada y apreciar el loading
      finalize(() => {
        loadingSvc.hide()
      })
    );
};
