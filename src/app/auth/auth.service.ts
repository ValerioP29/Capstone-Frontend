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

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  // 🔹 REGISTRAZIONE
  register(newUser: Partial<IUser>): Observable<IAccessData> {
    return this.http.post<IAccessData>(`${this.apiUrl}/register`, newUser).pipe(
      catchError((error) => {
        console.error('Errore durante la registrazione', error);
        return throwError(() => new Error('Registrazione fallita'));
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
    return this.authSubject$.value?.accessToken ?? null;
  }

  // 🔹 RESTORE USER DAL LOCALSTORAGE (Persistenza del login)
  private restoreUser(): void {
    const userJson = localStorage.getItem('userAccessData');
    if (!userJson) return;

    const accessData: IAccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) {
      localStorage.removeItem('userAccessData');
      return;
    }

    this.setSession(accessData);
  }

  // 🔹 MEMORIZZA L'UTENTE E GESTISCE IL LOGOUT AUTOMATICO
  private setSession(userAccessData: IAccessData): void {
    this.authSubject$.next(userAccessData);
    localStorage.setItem('userAccessData', JSON.stringify(userAccessData));

    const tokenExpirationDate = this.jwtHelper.getTokenExpirationDate(userAccessData.accessToken) as Date;
    if (tokenExpirationDate) {
      this.autoLogout(tokenExpirationDate);
    }
  }
}
