import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { NotFoundComponent } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: '**', component: NotFoundComponent }
];
