import { Controller, Get, Query, Res, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @Get('google/login')
  googleLogin(@Res() res: Response): void {
    const googleAuthUrl = this.authService.getGoogleAuthUrl();
    res.redirect(googleAuthUrl);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const tokens = await this.authService.googleAuthCallback(req.user);

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const redirectUrl = new URL(`${frontendUrl}/auth/google/callback`);

    redirectUrl.searchParams.append('accessToken', tokens.accessToken);
    redirectUrl.searchParams.append('refreshToken', tokens.refreshToken);

    res.redirect(redirectUrl.toString());
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req: any) {
    return req.user;
  }
}
