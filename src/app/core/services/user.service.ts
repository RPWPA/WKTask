// core/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../environment';
import { NewUser, User } from '../../types/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>(`${apiUrl}/users`); // No pagination params
  }

  createUser(user: NewUser) {
    return this.http.post<User>(`${apiUrl}/users/create`, user);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(`${apiUrl}/users/update/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${apiUrl}/users/delete`, {body: {'id': id}});
  }
}