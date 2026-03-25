import { Controller, Post, Body, Get, Res, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth-utils.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with OTP' })
  async verifyEmail(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset link' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('google/login')
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleLogin(@Res() res: Response): void {
    const googleAuthUrl = this.authService.getGoogleAuthUrl();
    res.redirect(googleAuthUrl);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.authService.googleAuthCallback(req.user);

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const redirectUrl = new URL(`${frontendUrl}/auth/google/callback`);

    redirectUrl.searchParams.append('accessToken', response.accessToken);
    redirectUrl.searchParams.append('refreshToken', response.refreshToken);
    redirectUrl.searchParams.append('userId', response.user.id);
    redirectUrl.searchParams.append('email', response.user.email);
    redirectUrl.searchParams.append('role', response.user.role);

    res.redirect(redirectUrl.toString());
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    return req.user;
  }
}
