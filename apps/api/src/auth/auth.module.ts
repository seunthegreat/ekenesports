import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { InitializationService } from './services/initialization.service';
import { BetterAuthController } from './better-auth.controller';

@Module({
  providers: [
    UsersService,
    InitializationService,
  ],
  controllers: [BetterAuthController],
  exports: [UsersService],
})
export class AuthModule { }
