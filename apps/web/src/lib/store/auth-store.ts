import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authClient } from '@ekene/auth';
import { type LoginFormValues, type RegisterFormValues } from '@ekene/shared';

interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  image?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (session: any) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  loginWithCredentials: (data: LoginFormValues) => Promise<void>;
  registerWithCredentials: (data: RegisterFormValues) => Promise<{ requiresVerification: boolean }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (sessionData) => {
        // Better Auth returns an object with { user, session }
        const user = sessionData?.user;
        if (user && user.id) {
          set({
            user: user as AuthUser,
            isAuthenticated: true
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },
      logout: async () => {
        await authClient.signOut();
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      loginWithCredentials: async (data) => {
        const { error } = await authClient.signIn.email({
          email: data.email,
          password: data.password,
          callbackURL: '/',
        });
        if (error) throw error;
      },
      registerWithCredentials: async (data) => {
        const { error } = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`.trim(),
          firstName: data.firstName,
          lastName: data.lastName,
          callbackURL: '/',
        });
        if (error) throw error;
        // Better Auth typically handles verification redirection or auto-login depending on config.
        return { requiresVerification: false };
      },
    }),
    { name: 'ekene-auth-storage' }
  )
);
