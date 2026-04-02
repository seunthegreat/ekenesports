"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  body?: any;
}

export const fetchClient = async (endpoint: string, options: FetchOptions = {}) => {
  const { body, ...rest } = options;
  
  const headers = new Headers(options.headers || {});
  if (body && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
    // Better Auth requirements for cookie-based sessions
    credentials: 'include',
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const api = {
  get: (url: string, options?: FetchOptions) => fetchClient(url, { ...options, method: 'GET' }),
  post: (url: string, body?: any, options?: FetchOptions) => fetchClient(url, { ...options, method: 'POST', body }),
  put: (url: string, body?: any, options?: FetchOptions) => fetchClient(url, { ...options, method: 'PUT', body }),
  patch: (url: string, body?: any, options?: FetchOptions) => fetchClient(url, { ...options, method: 'PATCH', body }),
  delete: (url: string, options?: FetchOptions) => fetchClient(url, { ...options, method: 'DELETE' }),
};
