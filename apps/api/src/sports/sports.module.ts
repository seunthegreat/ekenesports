import { Module } from '@nestjs/common';
import { SportsRouter } from './sports.router';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [SportsRouter],
  exports: [SportsRouter],
})
export class SportsModule {}
