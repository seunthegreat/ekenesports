import * as nodemailer from 'nodemailer';
import { verificationTemplate } from './templates/verification-template';
import { resetPasswordTemplate } from './templates/reset-password-template';
import { welcomeTemplate } from './templates/welcome-template';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL;
const APP_NAME = process.env.APP_NAME || 'Ekenesports';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const sendVerificationOTP = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your Ekenesports account',
      html: verificationTemplate(otp),
    });
    console.log(`[Auth] Verification OTP sent to ${email}`);
  } catch (error) {
    console.error(`[Auth] Failed to send verification OTP to ${email}:`, error);
  }
};

export const sendResetPasswordLink = async (email: string, url: string) => {
  try {
    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset your Ekenesports password',
      html: resetPasswordTemplate(url),
    });
    console.log(`[Auth] Reset password link sent to ${email}`);
  } catch (error) {
    console.error(`[Auth] Failed to send reset password link to ${email}:`, error);
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to Ekenesports!',
      html: welcomeTemplate(name, FRONTEND_URL),
    });
    console.log(`[Auth] Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`[Auth] Failed to send welcome email to ${email}:`, error);
  }
};

export const sendVerificationEmail = async (email: string, url: string) => {
  try {
    await transporter.sendMail({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your email address',
      html: `Click the link to verify your email: <a href="${url}">${url}</a>`,
    });
    console.log(`[Auth] Verification link sent to ${email}`);
  } catch (error) {
    console.error(`[Auth] Failed to send verification link to ${email}:`, error);
  }
};
