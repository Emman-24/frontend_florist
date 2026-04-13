import {HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError, timeout} from 'rxjs';
import {environment} from '../../environments/environment';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    timeout(environment.apiTimeout),
    catchError(err => {
      console.error(`[HTTP ${err.status}] ${req.url}`, err);
      return throwError(() => err);
    })
  );

