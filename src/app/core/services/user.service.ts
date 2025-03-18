// core/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../environment';
import { User } from '../../types/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>(`${apiUrl}/users`); // No pagination params
  }

  createUser(user: User) {
    return this.http.post<User>(`${apiUrl}/create`, user);
  }

  updateUser(id: string, user: User) {
    return this.http.put<User>(`${apiUrl}/update/${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${apiUrl}/delete/${id}`);
  }
}