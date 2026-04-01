import { z } from 'zod';

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;

export const getLoginSchema = (t: any) => z.object({
  email: z
    .string()
    .min(1, t('validation.email_required'))
    .email(t('validation.email_invalid')),
  password: z.string().min(1, t('validation.password_required')),
});

export const getVerifyOtpSchema = (t: any) => z.object({
  otp: z
    .string()
    .min(6, t('validation.otp_required'))
    .max(6, t('validation.otp_length'))
    .regex(/^\d+$/, t('validation.otp_digits')),
});

export const getForgotPasswordSchema = (t: any) => z.object({
  email: z
    .string()
    .min(1, t('validation.email_required'))
    .email(t('validation.email_invalid')),
});

export const getResetPasswordSchema = (t: any) => z
  .object({
    newPassword: z
      .string()
      .min(8, t('validation.password_min'))
      .regex(passwordComplexityRegex, t('validation.password_complexity')),
    confirmPassword: z.string().min(1, t('validation.confirm_password_required')),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t('validation.passwords_match'),
    path: ['confirmPassword'],
  });

// Export default schemas for type inference
export const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1).email(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(1),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
