import { Module } from '@nestjs/common';
import { CategoriesRouter } from './categories.router';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [CategoriesRouter],
  exports: [CategoriesRouter],
})
export class CategoriesModule {}
