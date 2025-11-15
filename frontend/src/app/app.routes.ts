import { Routes } from '@angular/router';
import { BeneficioFormComponent } from './components/beneficio-form/beneficio-form';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';
import { HomeComponent } from './components/home/home';
import { TransferFormComponent } from './components/transfer-form/transfer-form';
import { NotFoundComponent } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'beneficios', component: BeneficioListComponent },
  { path: 'beneficios/new', component: BeneficioFormComponent },
  { path: 'beneficios/:id/edit', component: BeneficioFormComponent },
  { path: 'transfer', component: TransferFormComponent },
  { path: '**', component: NotFoundComponent }
];
