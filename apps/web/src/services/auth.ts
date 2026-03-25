import apiClient from '@/lib/axios';
import { type LoginFormValues, type RegisterFormValues } from '@/lib/validations/auth';
import { AuthResponse, RegisterResponse, AuthUser } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

/** Redirects the browser to the Google OAuth initiation endpoint. */
export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google/login`;
};

export const loginUser = async (data: LoginFormValues): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await apiClient.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: { token: string; email: string; newPassword: string }) => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
  const response = await apiClient.put('/auth/change-password', data);
  return response.data;
};

export const refreshToken = async (data: { token: string }) => {
  const response = await apiClient.post('/auth/refresh-token', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const registerUser = async (data: RegisterFormValues): Promise<AuthResponse & RegisterResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/verify-email', data);
  return response.data;
};

export const resendOtp = async (data: { email: string; token?: string }) => {
  const response = await apiClient.post('/auth/resend-otp', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post('/auth/log-out');
  return response.data;
};
