import { baseTemplate } from './base-template';

export const verificationTemplate = (otp: string) => {
  const content = `
    <h2 style="font-size: 24px; color: #1A1A2E; margin-bottom: 16px; text-align: center;">Verify Your Identity</h2>
    <p style="text-align: center; color: #64748B;">Use the following security code to complete your registration. This code will expire in 10 minutes.</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <div style="display: inline-block; font-size: 42px; font-weight: 800; color: #0A6847; padding: 24px 48px; background: #F1F5F9; border-radius: 16px; letter-spacing: 12px; border: 2px solid #E2E8F0; font-family: 'Courier New', monospace;">
        ${otp}
      </div>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: #94A3B8;">If you didn't request this code, you can safely ignore this email.</p>
  `;
  return baseTemplate(content, 'Verify Your Email');
};
