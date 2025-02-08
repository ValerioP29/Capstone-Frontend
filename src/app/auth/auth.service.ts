import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, catchError } from 'rxjs';
import { IAccessData } from '../models/i-access-data';
import { IUser } from '../models/i-user';
import { ILogin } from '../models/i-login';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl: string = 'http://localhost:8080/api/auth'; // 🔹 URL del backend
  private authSubject$ = new BehaviorSubject<IAccessData | null>(null);
  user$ = this.authSubject$.asObservable().pipe(map((accessData) => accessData?.user));
  isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));

  private userRoles$ = new BehaviorSubject<string[]>(this.getRoles());
  roles$ = this.userRoles$.asObservable(); // Observable per la navbar

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  // 🔹 REGISTRAZIONE
  register(newUser: Partial<IUser>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, newUser, { observe: 'response' }).pipe(
      map(response => {
        if (response.status === 201) {
          return response.body!;
        } else {
          throw new Error('Registrazione fallita');
        }
      }),
      catchError(error => {
        console.error('Errore durante la registrazione:', error);
        return throwError(() => new Error('Errore sconosciuto nella registrazione.'));
      })
    );
  }




  // 🔹 LOGIN
  login(authData: ILogin): Observable<IAccessData> {
    return this.http.post<IAccessData>(`${this.apiUrl}/login`, authData).pipe(
      tap((userAccessData) => {
        this.setSession(userAccessData);
      }),
      catchError((error) => {
        console.error('Errore nel login', error);
        return throwError(() => new Error('Login fallito'));
      })
    );
  }

  // 🔹 SALVA IL TOKEN JWT
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // 🔹 LOGOUT
  logout(): void {
    this.authSubject$.next(null);
    localStorage.removeItem('userAccessData');
    clearTimeout(this.autoLogoutTimer);
    this.router.navigate(['/auth/login']);
  }

  // 🔹 AUTO LOGOUT DOPO SCADENZA TOKEN
  private autoLogoutTimer: any;
  private autoLogout(expirationDate: Date): void {
    clearTimeout(this.autoLogoutTimer);
    const expirationMs = expirationDate.getTime() - new Date().getTime();
    this.autoLogoutTimer = setTimeout(() => this.logout(), expirationMs);
  }

  // 🔹 OTTIENI L'ID DELL'UTENTE LOGGATO
  getUserId(): number | null {
    return this.authSubject$.value?.user?.id ?? null;
  }

  // 🔹 OTTIENI SOLO IL TOKEN JWT
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }


  // 🔹 RESTORE USER DAL LOCALSTORAGE (Persistenza del login)
  private restoreUser(): void {
    const token = this.getToken();
    if (!token) {
      console.warn('⚠️ Nessun token trovato in restoreUser');
      return;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      console.warn('⚠️ Token scaduto, rimuovo sessione');
      localStorage.removeItem('accessToken');
      return;
    }

    // 🔹 Decodifichiamo il token e ripristiniamo i ruoli
    const tokenPayload = this.jwtHelper.decodeToken(token);
    console.log('✅ Token ripristinato:', tokenPayload);

    const roles = tokenPayload?.roles || [];
    console.log('✅ Ruoli ripristinati:', roles);

    this.userRoles$.next(roles);
  }





  // 🔹 MEMORIZZA L'UTENTE E GESTISCE IL LOGOUT AUTOMATICO
  private setSession(userAccessData: IAccessData): void {
    console.log('🔹 Dati ricevuti in setSession:', userAccessData);

    // 🔹 Controlliamo che il backend abbia restituito il token
    if (!userAccessData || !userAccessData.token) {
      console.error('❌ Errore: Il backend non ha restituito un token valido');
      return;
    }

    // 🔹 Salviamo il token nel localStorage
    localStorage.setItem('accessToken', userAccessData.token);
    this.authSubject$.next(userAccessData);

    // 🔹 Decodifichiamo il token e otteniamo i ruoli
    const tokenPayload = this.jwtHelper.decodeToken(userAccessData.token);
    console.log('✅ Token decodificato:', tokenPayload);

    const roles = tokenPayload?.roles || [];
    console.log('✅ Ruoli aggiornati dal token:', roles);

    // 🔹 Aggiorniamo i ruoli della navbar
    this.userRoles$.next(roles);
  }





  getRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      console.warn('⚠️ Nessun token trovato in getRoles()');
      return [];
    }

    const tokenPayload = this.jwtHelper.decodeToken(token);
    console.log('✅ Ruoli trovati nel token:', tokenPayload.roles);

    return Array.isArray(tokenPayload.roles) ? tokenPayload.roles : [tokenPayload.roles];
  }



  hasRole(requiredRoles: string[]): boolean {
    const userRoles = this.getRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
