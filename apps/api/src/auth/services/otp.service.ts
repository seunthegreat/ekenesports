import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateOtp(userId: string, type: string) {
    const otpCode = this.generateOtpCode();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // 10 minutes expiry

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        otpCode,
        otpExpires: expires,
        otpType: type,
      },
    });

    return otpCode;
  }

  async verifyOtp(userId: string, code: string, type: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.otpCode !== code || user.otpType !== type || !user.otpExpires || user.otpExpires < new Date()) {
      return false;
    }

    // Clear OTP after successful verification
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        otpCode: null,
        otpExpires: null,
        otpType: null,
      },
    });

    return true;
  }
}
