"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.requestPasswordReset = exports.sendVerificationEmail = exports.signUp = exports.signOut = exports.signIn = exports.useSession = exports.authClient = void 0;
const react_1 = require("better-auth/react");
const plugins_1 = require("better-auth/client/plugins");
exports.authClient = (0, react_1.createAuthClient)({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000',
    plugins: [
        (0, plugins_1.inferAdditionalFields)(),
        (0, plugins_1.emailOTPClient)(),
    ],
});
exports.useSession = exports.authClient.useSession, exports.signIn = exports.authClient.signIn, exports.signOut = exports.authClient.signOut, exports.signUp = exports.authClient.signUp, exports.sendVerificationEmail = exports.authClient.sendVerificationEmail, exports.requestPasswordReset = exports.authClient.requestPasswordReset, exports.resetPassword = exports.authClient.resetPassword, exports.changePassword = exports.authClient.changePassword;
