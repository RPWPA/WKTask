export interface User {
    id: number;
    fname: string;
    lname: string;
    username: string;
    email: string;
    avatar: string;
}

export type NewUser = Omit<User, 'id'>; // Type for user creation
