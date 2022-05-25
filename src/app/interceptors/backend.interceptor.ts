import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import { MessageTypeEnum } from '../models/messageTypeEnum';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private uiService: UiService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (!!token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
        },
      });
    }

    this.uiService.loaderSubject.next(true);

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse): Observable<HttpEvent<any>> => {
        // qualquer erro http na casa dos 400 ou 500 será tratado
        if (err.status >= 400 && err.status <= 600) {
          // se for um erro 401 unauthorized, realizará o logout
          // caso contrário, só aparecerá uma mensagem de erro e continuará a aplicação
          if (err.status === 401) {
            this.authService.logout();
          }

          this.uiService.toastSubject.next({
            message: err.message,
            messageType: MessageTypeEnum.ERROR,
          });
        }

        return throwError(() => new Error(err.error));
      }),
      finalize(() => {
        this.uiService.loaderSubject.next(false);
      })
    );
  }
}
