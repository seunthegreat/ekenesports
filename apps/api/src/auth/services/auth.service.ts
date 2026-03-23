import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  getGoogleAuthUrl(): string {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get('GOOGLE_REDIRECT_URI') || 
      `${this.configService.get('BACKEND_URL')}/auth/google/callback`;
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

  async googleAuthCallback(googleUser: any) {
      if (!googleUser) {
        throw new Error('No user data from Google');
      }

      // PERSIST USER TO DATABASE (Real data from Google Strategy)
      const user = await this.prisma.user.upsert({
          where: { email: googleUser.email },
          update: {
              firstName: googleUser.firstName,
              lastName: googleUser.lastName,
              picture: googleUser.picture,
          },
          create: {
              email: googleUser.email,
              firstName: googleUser.firstName,
              lastName: googleUser.lastName,
              picture: googleUser.picture,
              role: 'CUSTOMER',
          },
      });
      
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
          }
      };
  }
}
