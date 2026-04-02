import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authClient } from '@ekene/auth';
import { type LoginFormValues } from '@ekene/shared';

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (sessionData) => {
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
        const result = await authClient.signIn.email({
          email: data.email,
          password: data.password,
          callbackURL: '/',
        });
        
        if (result.error) throw result.error;
        const session = result.data;

        // Role Protection: Check if the user trying to login is a customer
        if (session?.user && (session.user as any).role === 'CUSTOMER') {
          await authClient.signOut();
          throw new Error('Access Denied: Customers are not allowed to access the admin panel.');
        }

        if (session?.user) {
          set({ 
            user: session.user as AuthUser, 
            isAuthenticated: true 
          });
        }
      },
    }),
    { name: 'ekene-admin-auth-storage' }
  )
);
