import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields, emailOTPClient } from 'better-auth/client/plugins';
import type { auth } from './auth';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000',
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
  ],
});

export const { useSession, signIn, signOut, signUp, sendVerificationEmail, requestPasswordReset, resetPassword, changePassword } = authClient;
