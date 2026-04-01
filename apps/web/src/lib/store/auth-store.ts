import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { loginUser, registerUser } from '@/services/auth';
import { type LoginFormValues, type RegisterFormValues } from '@/lib/validations/auth';
import { AuthUser, RegisterPayload } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  loginWithCredentials: (data: LoginFormValues) => Promise<void>;
  registerWithCredentials: (data: RegisterPayload) => Promise<{ requiresVerification: boolean }>;
}

const COOKIE_NAME = 'auth-token';
const COOKIE_OPTIONS: Cookies.CookieAttributes = { 
  expires: 7, 
  secure: true, 
  sameSite: 'strict' 
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) => {
        Cookies.set(COOKIE_NAME, accessToken, COOKIE_OPTIONS);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove(COOKIE_NAME);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      loginWithCredentials: async (data) => {
        const res = await loginUser(data);
        Cookies.set(COOKIE_NAME, res.accessToken, COOKIE_OPTIONS);
        set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isAuthenticated: true });
      },
      registerWithCredentials: async (data) => {
        const res = await registerUser(data);
        if (res.accessToken) {
          Cookies.set(COOKIE_NAME, res.accessToken, COOKIE_OPTIONS);
          set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isAuthenticated: true });
          return { requiresVerification: false };
        }
        return { requiresVerification: true };
      },
    }),
    { name: 'auth-storage' }
  )
);
