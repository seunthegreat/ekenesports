import { api } from '@/lib/fetch-client';
import { type LoginFormValues } from '@/lib/validations/auth';
import { AuthResponse, RegisterResponse, AuthUser, RegisterPayload } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** Redirects the browser to the Google OAuth initiation endpoint. */
export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google/login`;
};

export const loginUser = async (data: LoginFormValues): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const forgotPassword = async (data: { email: string }) => {
  return api.post('/auth/forgot-password', data);
};

export const resetPassword = async (data: { token: string; email: string; newPassword: string }) => {
  return api.post('/auth/reset-password', data);
};

export const changePassword = async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
  return api.put('/auth/change-password', data);
};

export const refreshToken = async (data: { token: string }) => {
  return api.post('/auth/refresh-token', data);
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  return api.get('/auth/me');
};

export const registerUser = async (data: RegisterPayload): Promise<AuthResponse & RegisterResponse> => {
  return api.post('/auth/register', data);
};

export const verifyOtp = async (data: { email: string; otp: string }): Promise<AuthResponse> => {
  return api.post('/auth/verify-email', data);
};

export const resendOtp = async (data: { email: string; token?: string }) => {
  return api.post('/auth/resend-otp', data);
};

export const logoutUser = async () => {
  return api.post('/auth/log-out');
};
