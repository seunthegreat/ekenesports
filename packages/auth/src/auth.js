"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
require("dotenv/config");
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const db_1 = require("@ekene/db");
const plugins_1 = require("better-auth/plugins");
const mailer = __importStar(require("./mail"));
const prisma = new db_1.PrismaClient();
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma, {
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
        (0, plugins_1.emailOTP)({
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
            mapProfileToUser: (profile) => {
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
