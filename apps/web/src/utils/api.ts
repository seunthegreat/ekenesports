
import axios from 'axios';
import { useAuthStore } from '@/lib/store/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';
            // Skip refresh logic for login and register endpoints
            if (
                requestUrl.includes('/login') ||
                requestUrl.includes('/register')
            ) {
                return Promise.reject(error);
            }

            // Try to refresh token using Zustand store
            try {
                const authStore = useAuthStore.getState();
                const refreshToken = authStore.refreshToken;
                if (!refreshToken) {
                    // No refresh token, force logout
                    authStore.logout();
                    if (typeof window !== 'undefined') {
                        const isAdmin = window.location.pathname.startsWith('/admin');
                        window.location.href = isAdmin ? '/admin/login' : '/login';
                    }
                    return Promise.reject(error);
                }
                // Call refresh endpoint
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );
                const { accessToken, refreshToken: newRefreshToken, user } = refreshResponse.data;
                // Update tokens in Zustand
                authStore.login(user, accessToken, newRefreshToken);
                // Update Authorization header and retry original request
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return api.request(error.config);
            } catch (refreshError) {
                // Refresh failed, force logout
                const authStore = useAuthStore.getState();
                authStore.logout();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
