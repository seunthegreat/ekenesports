import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { auth } from '@ekene/auth/server';

@Injectable()
export class InitializationService implements OnModuleInit {
  private readonly logger = new Logger(InitializationService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) { }

  async onModuleInit() {
    await this.initializeSuperAdmin();
  }

  private async initializeSuperAdmin() {
    const superAdminEmail = this.config.get<string>('INITIAL_SUPERADMIN_EMAIL');
    const superAdminPassword = this.config.get<string>('INITIAL_SUPERADMIN_PASSWORD');

    if (!superAdminEmail || !superAdminPassword) {
      this.logger.warn('SUPERADMIN credentials not found in environment variables. Skipping initialization.');
      return;
    }

    try {
      // 1. Check if superadmin user already exists with credential account
      const existingUser = await this.prisma.user.findUnique({
        where: { email: superAdminEmail },
        include: { accounts: true }, // Verify credentials exist
      });

      const hasCredentialAccount = existingUser?.accounts.some(acc => acc.providerId === 'credential');

      // If user exists BUT has no credentials (Account), delete and recreate
      if (existingUser && !hasCredentialAccount) {
        this.logger.warn(`User ${superAdminEmail} exists but has no "credential" provider account. Deleting and recreating to fix login...`);
        await this.prisma.user.delete({ where: { id: existingUser.id } });
      } else if (existingUser) {
        // Upgrade role if exists but not SUPER_ADMIN or not verified
        if (existingUser.role !== 'SUPER_ADMIN' || !existingUser.emailVerified) {
          await this.prisma.user.update({
            where: { email: superAdminEmail },
            data: {
              role: 'SUPER_ADMIN' as any,
              emailVerified: true,
            },
          });
          this.logger.log(`Ensured user ${superAdminEmail} is SUPER_ADMIN and emailVerified.`);
        } else {
          this.logger.log(`SuperAdmin account already exists and is correctly configured: ${superAdminEmail}`);
        }
        return;
      }

      this.logger.log(`Creating SuperAdmin account: ${superAdminEmail}...`);

      // 2. Create using BetterAuth API to handle hashing
      // Note: SignUp server-side bypasses some checks but ensures consistency
      await auth.api.signUpEmail({
        body: {
          email: superAdminEmail,
          password: superAdminPassword,
          firstName: 'Super',
          lastName: 'Admin',
          name: 'Super Admin',
        },
      });

      // 3. Set the role (BetterAuth might default to CUSTOMER) and ensure verified
      await this.prisma.user.update({
        where: { email: superAdminEmail },
        data: {
          role: 'SUPER_ADMIN' as any,
          emailVerified: true
        },
      });

      this.logger.log(`SuperAdmin account initialized successfully: ${superAdminEmail}`);
    } catch (error) {
      this.logger.error('Failed to initialize SuperAdmin account:', error);
    }
  }
}
