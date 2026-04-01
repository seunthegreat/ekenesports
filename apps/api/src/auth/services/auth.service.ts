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
import * as argon2 from 'argon2';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly pepper: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {
    this.pepper = this.configService.get<string>('SECRET_PEPPER', 'default_pepper_change_me');
  }

  private async hashPassword(password: string): Promise<string> {
    // Combine password with pepper before hashing
    return argon2.hash(password + this.pepper, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  private async verifyPassword(password: string, hash: string): Promise<{ isValid: boolean; needsMigration: boolean }> {
    // Check if it's an argon2 hash
    if (hash.startsWith('$argon2')) {
      const isValid = await argon2.verify(hash, password + this.pepper);
      return { isValid, needsMigration: false };
    }

    // Fallback to bcrypt for lazy migration
    if (hash.startsWith('$2b$') || hash.startsWith('$2a$')) {
      const isValid = await bcrypt.compare(password, hash);
      return { isValid, needsMigration: isValid };
    }

    return { isValid: false, needsMigration: false };
  }

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

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      if (!existingUser.password && existingUser.googleId) {
        throw new ConflictException('This email is already registered via Google. Please login with Google or use forgot password to set a password.');
      }
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.CUSTOMER, // Always force CUSTOMER for public registration
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
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password && user.googleId) {
      throw new UnauthorizedException('This account was created with Google. Please use "Continue with Google" to sign in, or use "Forgot Password" to create a password.');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { isValid, needsMigration } = await this.verifyPassword(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Lazy migration from Bcrypt to Argon2id
    if (needsMigration) {
      const newHash = await this.hashPassword(dto.password);
      await this.usersService.update(user.id, { password: newHash });
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

    const hashedPassword = await this.hashPassword(dto.newPassword);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: 'Password reset successful. You can now login with your new password.' };
  }

  private async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d', secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh_secret' }),
    ]);

    return { accessToken, refreshToken };
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

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Return generic message to prevent email enumeration
      return { message: 'If an account exists with this email, a new verification code has been sent.' };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('This email address is already verified.');
    }

    const otp = await this.otpService.generateOtp(user.id, 'email_verification');
    await this.mailService.sendVerificationEmail(user.email, otp);

    return { message: 'If an account exists with this email, a new verification code has been sent.' };
  }

  async refreshToken(refreshTokenValue: string) {
    try {
      const payload = this.jwtService.verify(refreshTokenValue, { secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh_secret' });
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
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
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.password) {
      throw new BadRequestException('Cannot change password for this account type.');
    }

    const { isValid } = await this.verifyPassword(oldPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.usersService.update(userId, { password: hashedPassword });

    return { message: 'Password changed successfully.' };
  }
}
