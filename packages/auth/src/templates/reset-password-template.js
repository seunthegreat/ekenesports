"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTemplate = void 0;
const base_template_1 = require("./base-template");
const resetPasswordTemplate = (resetUrl) => {
    const content = `
    <h2 style="font-size: 24px; color: #1A1A2E; margin-bottom: 16px; text-align: center;">Reset Your Password</h2>
    <p style="text-align: center; color: #64748B;">We received a request to reset your password. No worries, it happens to the best of us!</p>
    
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: #64748B; margin-top: 24px;">If the button above doesn't work, copy and paste this link into your browser:</p>
    <div style="background-color: #F1F5F9; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 12px; color: #0A6847; text-align: center;">
      ${resetUrl}
    </div>
    
    <p style="text-align: center; font-size: 14px; color: #94A3B8; margin-top: 32px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
  `;
    return (0, base_template_1.baseTemplate)(content, 'Reset Your Password');
};
exports.resetPasswordTemplate = resetPasswordTemplate;
