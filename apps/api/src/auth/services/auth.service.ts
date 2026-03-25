import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { MailService } from './mail.service';
import { OtpService } from './otp.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto, ResetPasswordDto } from '../dto/auth-utils.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  getGoogleAuthUrl(): string {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get('GOOGLE_REDIRECT_URI');
    const scope = 'openid email profile';

    return `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;
  }

  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      if (!existingUser.password && existingUser.googleId) {
        throw new ConflictException('This email is already registered via Google. Please login with Google or use forgot password to set a password.');
      }
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || Role.CUSTOMER,
      isEmailVerified: false,
    });

    const otp = await this.otpService.generateOtp(user.id, 'email_verification');
    await this.mailService.sendVerificationEmail(user.email, otp);

    return {
      message: 'Registration successful. Please check your email for the verification code.',
      userId: user.id,
    };
  }

  async verifyEmail(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.otpService.verifyOtp(user.id, dto.otp, 'email_verification');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.usersService.update(user.id, { isEmailVerified: true });
    await this.mailService.sendWelcomeEmail(user.email, user.firstName || 'User');

    const tokens = await this.generateToken(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email address first');
    }

    await this.usersService.updateLastLogin(user.id);
    const tokens = await this.generateToken(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If an account exists with this email, a reset link has been sent.' };
    }

    const resetToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.usersService.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: expires,
    });

    await this.mailService.sendResetPasswordLink(user.email, resetToken);

    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || user.resetPasswordToken !== dto.token || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: 'Password has been reset successfully' };
  }

  async googleAuthCallback(googleUser: any) {
    if (!googleUser) {
      throw new UnauthorizedException('No user data from Google');
    }

    let user = await this.usersService.findByEmail(googleUser.email);
    if (user) {
      // Auto-link if email matches (Google verified)
      user = await this.usersService.update(user.id, {
        firstName: user.firstName || googleUser.firstName,
        lastName: user.lastName || googleUser.lastName,
        picture: user.picture || googleUser.picture,
        isEmailVerified: true,
      });
    } else {
      user = await this.usersService.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        role: Role.CUSTOMER,
        isEmailVerified: true,
      });
      // Send welcome email - we don't await this strictly to avoid blocking login if mail server is slow/down
      // The mail service already has internal try-catch
      this.mailService.sendWelcomeEmail(user.email, user.firstName || 'User');
    }

    await this.usersService.updateLastLogin(user.id);
    const tokens = await this.generateToken(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
    };
  }
}
