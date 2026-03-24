import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private subject = new BehaviorSubject<AuthResponse | null>(this.stored());
  currentUser$    = this.subject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get user()       { return this.subject.value; }
  get token()      { return this.subject.value?.token; }
  get isLoggedIn() { return !!this.subject.value; }

  register(data: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(tap(u => this.save(u)));
  }

  login(data: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, data)
      .pipe(tap(u => this.save(u)));
  }

  logout() {
    localStorage.removeItem('fp_user');
    this.subject.next(null);
    this.router.navigate(['/login']);
  }

  private save(u: AuthResponse) {
    localStorage.setItem('fp_user', JSON.stringify(u));
    this.subject.next(u);
  }

  private stored(): AuthResponse | null {
    const s = localStorage.getItem('fp_user');
    return s ? JSON.parse(s) : null;
  }
}