// core/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiUrl } from '../../environment';
import { NewUser, User, UsersResponse } from '../../types/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(params: {
    search: string,
    page: number,
    per_page: number,
    sort_column: string,
    sort_order: 'asc' | 'desc'
  }) {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('per_page', params.per_page.toString())
      .set('sort_column', params.sort_column)
      .set('sort_order', params.sort_order);
  
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
  
    return this.http.get<UsersResponse>(`${apiUrl}/users`, {
      params: httpParams
    });
  }

  createUser(user: NewUser) {
    return this.http.post<User>(`${apiUrl}/users/create`, user);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(`${apiUrl}/users/update/`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${apiUrl}/users/delete`, {body: {'id': id}});
  }
}