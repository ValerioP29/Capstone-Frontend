import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authSvc.isLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          console.warn('⚠️ Utente non autenticato. Reindirizzo al login.');
          this.router.navigate(['/login']);
          return false;
        }

        // Controllo dei ruoli richiesti
        const requiredRoles = route.data['roles'] as string[];
        if (requiredRoles && !this.authSvc.hasRole(requiredRoles)) {
          console.warn('⚠️ Utente non ha i permessi richiesti. Reindirizzo alla dashboard.');
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true;
      })
    );
  }
}
