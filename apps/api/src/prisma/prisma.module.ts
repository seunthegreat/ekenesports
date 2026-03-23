import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Make PrismaService available throughout the application
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
