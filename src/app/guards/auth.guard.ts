import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (['/login', '/account'].includes(state.url)) {
      if (!!this.authService.getToken()) {
        this.router.navigateByUrl('/home');
        return false;
      }
      return true;
    }

    if (!this.authService.getToken()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
