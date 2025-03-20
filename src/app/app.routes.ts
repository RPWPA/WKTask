// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'users',
    loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent)
  },
  { 
    path: 'attractions',
    loadComponent: () => import('./attractions/attraction-list/attraction-list.component').then(m => m.AttractionListComponent)
  },
  { 
    path: 'pet-sales',
    loadComponent: () => import('./pet-sales/pet-sales/pet-sales.component').then(m => m.PetSalesComponent)
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' }
];