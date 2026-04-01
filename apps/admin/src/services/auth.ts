import apiClient from '@/lib/axios';
import { type LoginFormValues } from '@/lib/validations/auth';
import { AuthResponse, AuthUser } from '@/types/auth';

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

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
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

export const logoutUser = async () => {
  const response = await apiClient.post('/auth/log-out');
  return response.data;
};
