export interface User {
    id: number;
    fname: string;
    lname: string;
    username: string;
    email: string;
    avatar: string;
}

// types/user.ts
export interface UsersResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[];
  }

export type NewUser = Omit<User, 'id'>; // Type for user creation
