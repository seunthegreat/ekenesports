import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { loginUser } from '@/services/auth';
import { type LoginFormValues } from '@/lib/validations/auth';
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
}

const COOKIE_NAME = 'admin-token';
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
        // Set cookie for middleware/proxy access
        Cookies.set(COOKIE_NAME, accessToken, { expires: 7, secure: true, sameSite: 'strict' });
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
        
        // Role Protection: Check if the user trying to login is a customer
        if (res.user.role === 'CUSTOMER') {
          throw new Error('Access Denied: Customers are not allowed to access the admin panel.');
        }
        
        // Set cookie for middleware/proxy access
        Cookies.set(COOKIE_NAME, res.accessToken, { expires: 7, secure: true, sameSite: 'strict' });

        set({ 
          user: res.user, 
          accessToken: res.accessToken, 
          refreshToken: res.refreshToken, 
          isAuthenticated: true 
        });
      },
    }),
    { name: 'admin-auth-storage' }
  )
);
