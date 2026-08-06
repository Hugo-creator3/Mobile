import { Routes } from '@angular/router';
import { NabvarComponent } from './shared/nabvar/nabvar.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'card',
    loadComponent: () => import('./pages/card/card.component').then((m) => m.CardComponent),
  },
  {
    path: 'card/:id',
    loadComponent: () => import('./pages/card/card.component').then((m) => m.CardComponent),
  },
  {
    path: 'biometric-checkin',
    loadComponent: () => import('./pages/biometric-checkin/biometric-checkin.component').then((m) => m.BiometricCheckinComponent),
  },
  {
    path: 'checkin-result',
    loadComponent: () => import('./pages/checkin-result/checkin-result.page').then((m) => m.CheckinResultPage),
  },
  {
    path: 'tabs',           // ← ya no es ''
    component: NabvarComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path: 'main',
        loadComponent: () => import('./pages/main/main.component').then((m) => m.MainComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/history/history.component').then((m) => m.HistoryComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
];