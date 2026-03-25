export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  picture?: string;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface GoogleAuthData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  expires: string;
  accessToken: string;
  idToken: string;
}
