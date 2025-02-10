import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {
    console.log('Roleguard Inizializzato');


  }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authSvc.roles$.pipe(
      map((roles) => {
        console.log('🔎 RoleGuard → Ruoli attuali al momento del controllo:', roles);
        console.log('🔎 RoleGuard → Utente è loggato?', this.authSvc.isLoggedIn$);

        if (!roles || roles.length === 0) {
          console.warn('⚠️ Nessun ruolo trovato. Reindirizzo al login.');
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRoles = route.data['roles'] as string[];
        console.log('🔎 RoleGuard → Ruoli richiesti per questa pagina:', requiredRoles);

        if (!this.authSvc.hasRole(requiredRoles)) {
          console.warn('🚫 Accesso negato! Reindirizzamento alla dashboard...');
          this.router.navigate(['/dashboard']);
          return false;
        }

        console.log('✅ Accesso consentito alla rotta:', state.url);
        return true;
      })
    );
  }


}
