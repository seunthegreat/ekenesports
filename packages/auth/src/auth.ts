import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@ekene/db';
import { emailOTP } from 'better-auth/plugins';
import type { GoogleProfile } from 'better-auth/social-providers';
import * as mailer from './mail';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL: process.env.BETTER_AUTH_URL ? `${process.env.BETTER_AUTH_URL}/api/auth` : 'http://127.0.0.1:4000/api/auth',
  trustHost: true,
  trustedOrigins: Array.from(new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
  ].filter(Boolean))),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await mailer.sendVerificationOTP(email, otp);
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === 'production',
    sendResetPassword: async ({ user, url, token }) => {
      await mailer.sendResetPasswordLink(user.email, url);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await mailer.sendVerificationEmail(user.email, url);
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      mapProfileToUser: (profile: GoogleProfile) => {
        return {
          firstName: profile.given_name || '',
          lastName: profile.family_name || '',
          role: 'CUSTOMER',
        };
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.role === 'USER' || !user.role) {
            user.role = 'CUSTOMER';
          }
          return {
            data: user,
          };
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'CUSTOMER',
      },
      firstName: { type: 'string', required: false },
      lastName: { type: 'string', required: false },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
