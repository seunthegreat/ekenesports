import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { welcomeTemplate } from '../../mail/templates/welcome-template';
import { verificationTemplate } from '../../mail/templates/verification-template';
import { resetPasswordTemplate } from '../../mail/templates/reset-password-template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT', '2525'), 10),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  private async sendMail(options: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(options);
      console.log(`[MailService] Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[MailService] Failed to send email to ${options.to}:`, error);
      return null;
    }
  }

  async sendVerificationEmail(email: string, otp: string) {
    return this.sendMail({
      from: `"${this.configService.get('APP_NAME', 'Ekenesports')}" <${this.configService.get('FROM_EMAIL')}>`,
      to: email,
      subject: 'Verify your Ekenesports account',
      html: verificationTemplate(otp),
    });
  }

  async sendResetPasswordLink(email: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${email}`;

    return this.sendMail({
      from: `"${this.configService.get('APP_NAME', 'Ekenesports')}" <${this.configService.get('FROM_EMAIL')}>`,
      to: email,
      subject: 'Reset your Ekenesports password',
      html: resetPasswordTemplate(resetLink),
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');

    return this.sendMail({
      from: `"${this.configService.get('APP_NAME', 'Ekenesports')}" <${this.configService.get('FROM_EMAIL')}>`,
      to: email,
      subject: 'Welcome to Ekenesports!',
      html: welcomeTemplate(name, frontendUrl),
    });
  }
}
