import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'players',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/players/player-list/player-list.component')
        .then(m => m.PlayerListComponent)
  },
  {
    path: 'players/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/players/player-form/player-form.component')
        .then(m => m.PlayerFormComponent)
  },
  {
    path: 'history',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/predictions/prediction-history/prediction-history.component')
        .then(m => m.PredictionHistoryComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];