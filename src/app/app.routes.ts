import { Routes } from '@angular/router';
// app.routes.ts
export const routes: Routes = [
    { 
      path: 'users',
      loadComponent: () => import('./users/user-list/user-list.component')
        .then(m => m.UserListComponent)
    },
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: '**', redirectTo: 'users' }
  ];