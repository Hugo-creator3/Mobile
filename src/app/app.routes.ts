import { Routes } from '@angular/router';
import { Login } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { card, idCard, settings } from 'ionicons/icons';
import { HistoryComponent } from './pages/history/history.component';
import { CardComponent } from './pages/card/card.component';
import { MainComponent } from './pages/main/main.component';
import { NabvarComponent } from './shared/nabvar/nabvar.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { BiometricCheckinComponent } from './pages/biometric-checkin/biometric-checkin.component';


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
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
    path: '',
    component: NabvarComponent, // El componente que acabamos de crear
    children: [
 
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
  { path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
  }
    ]
  },
  {
    path: 'checkin-result',
    loadComponent: () => import('./pages/checkin-result/checkin-result.page').then( m => m.CheckinResultPage)
  },


  
];
