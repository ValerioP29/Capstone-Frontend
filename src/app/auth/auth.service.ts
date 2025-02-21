import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, catchError, throwError } from 'rxjs';
import { IAccessData } from '../models/i-access-data';
import { IUser } from '../models/i-user';
import { ILogin } from '../models/i-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl: string = 'http://localhost:8080/api/auth'; // 🔹 URL del backend
  private authSubject$ = new BehaviorSubject<IAccessData | null>(null);
  user$ = this.authSubject$.asObservable().pipe(map((accessData) => accessData?.user));
  isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));

  private userRoles$ = new BehaviorSubject<string[]>([]);
  roles$ = this.userRoles$.asObservable(); // Observable per la navbar

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser(); // 🔥 Ripristina utente se il token è valido
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
    localStorage.setItem('token', token);
  }

  // 🔹 LOGOUT
  logout(): void {
    console.log('🔴 Effettuando il logout...');

    this.authSubject$.next(null); // ✅ Resetta lo stato utente
    this.userRoles$.next([]); // ✅ Resetta i ruoli nella navbar
    localStorage.removeItem('userAccessData'); // ✅ Rimuove i dati salvati
    localStorage.removeItem('token'); // ✅ Rimuove il token JWT

    this.router.navigate(['/login']); // ✅ Corretto redirect al login
    console.log('✅ Logout completato!');
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
    const userAccessData = this.authSubject$.value;

    if (!userAccessData || !userAccessData.user || !userAccessData.user.id) {
      console.warn("⚠️ Nessun ID utente trovato, probabilmente non autenticato.");
      return null;
    }

    console.log("🔍 User trovato in AuthService:", userAccessData.user);
    return Number(userAccessData.user.id); // 🔥 Assicuriamoci che sia un numero
  }


  // 🔹 OTTIENI SOLO IL TOKEN JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🔹 RESTORE USER DAL LOCALSTORAGE (Persistenza del login)
  private restoreUser(): void {
    console.log('🔄 Tentativo di ripristino utente...');

    const token = this.getToken();
    console.log('🧐 Token recuperato:', token); // 🛑 Controlliamo cosa c'è nel localStorage

    if (!token) {
      console.warn('⚠️ Nessun token trovato in restoreUser');
      return;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      console.warn('⚠️ Token scaduto, rimuovo sessione');
      this.logout();
      return;
    }

    try {
      const tokenPayload = this.jwtHelper.decodeToken(token);
      console.log('✅ Token decodificato:', tokenPayload);

      if (!tokenPayload || !tokenPayload.roles) {
        console.error('❌ Errore: Token non valido o mancano i ruoli!');
        this.logout();
        return;
      }

      this.authSubject$.next({
        token: token,
        user: {
          id: tokenPayload.id,
          username: tokenPayload.sub,
          role: tokenPayload.roles,
        },
      });
      this.isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));

      this.userRoles$.next(tokenPayload.roles);
    } catch (error) {
      console.error('🚨 Errore nella decodifica del token:', error);
      this.logout(); // 🛑 Se il token non è valido, forziamo il logout
    }
  }

  // 🔹 MEMORIZZA L'UTENTE E GESTISCE IL LOGOUT AUTOMATICO
  private setSession(userAccessData: IAccessData): void {
    console.log('🔹 Dati ricevuti in setSession:', userAccessData);

    if (!userAccessData || !userAccessData.token) {
      console.error('❌ Errore: Il backend non ha restituito un token valido');
      return;
    }

    localStorage.setItem('token', userAccessData.token); // ✅ Assicurati che sia salvato correttamente

    this.authSubject$.next(userAccessData);

    const tokenPayload = this.jwtHelper.decodeToken(userAccessData.token);
    console.log('✅ Token decodificato:', tokenPayload);

    const roles = tokenPayload?.roles || [];
    console.log('✅ Ruoli aggiornati dal token:', roles);

    this.userRoles$.next(roles);

     // 🔥 Assicuriamoci di aggiornare l'ID dell'utente subito dopo il login
  if (tokenPayload.id) {
    this.authSubject$.next({
      token: userAccessData.token,
      user: {
        id: Number(tokenPayload.id),
        username: tokenPayload.sub,
        role: tokenPayload.roles,
      },
    });
  }

  }

  // 🔹 OTTIENI I RUOLI DAL TOKEN
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

  // 🔹 VERIFICA SE L'UTENTE HA IL RUOLO RICHIESTO
  hasRole(requiredRoles: string[]): boolean {
    const userRoles = this.getRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
