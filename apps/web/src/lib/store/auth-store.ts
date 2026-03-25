import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, registerUser } from '@/services/auth';
import { type LoginFormValues, type RegisterFormValues } from '@/lib/validations/auth';
import { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  loginWithCredentials: (data: LoginFormValues) => Promise<void>;
  registerWithCredentials: (data: RegisterFormValues) => Promise<{ requiresVerification: boolean }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      loginWithCredentials: async (data) => {
        const res = await loginUser(data);
        set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isAuthenticated: true });
      },
      registerWithCredentials: async (data) => {
        const res = await registerUser(data);
        if (res.accessToken) {
          set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isAuthenticated: true });
          return { requiresVerification: false };
        }
        return { requiresVerification: true };
      },
    }),
    { name: 'auth-storage' }
  )
);
