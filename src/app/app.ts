import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <nav class="navbar" *ngIf="auth.isLoggedIn">
        <div class="nav-brand">
          <span class="logo">⚽</span>
          <span class="brand-name">Football AI</span>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/players"   routerLinkActive="active">Players</a>
          <a routerLink="/history"   routerLinkActive="active">History</a>
        </div>
        <div class="nav-user">
          <span class="username">{{ auth.user?.username }}</span>
          <button class="btn-logout" (click)="auth.logout()">Logout</button>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}