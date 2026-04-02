"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationTemplate = void 0;
const base_template_1 = require("./base-template");
const verificationTemplate = (otp) => {
    const content = `
    <h2 style="font-size: 24px; color: #1A1A2E; margin-bottom: 16px; text-align: center;">Verify Your Identity</h2>
    <p style="text-align: center; color: #64748B;">Use the following security code to complete your registration. This code will expire in 10 minutes.</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <div style="display: inline-block; font-size: 32px; font-weight: 800; color: #0A6847; padding: 20px 24px; background: #F1F5F9; border-radius: 16px; letter-spacing: 8px; border: 2px solid #E2E8F0; font-family: 'Courier New', monospace; max-width: 100%; box-sizing: border-box;">
        ${otp}
      </div>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: #94A3B8;">If you didn't request this code, you can safely ignore this email.</p>
  `;
    return (0, base_template_1.baseTemplate)(content, 'Verify Your Email');
};
exports.verificationTemplate = verificationTemplate;
